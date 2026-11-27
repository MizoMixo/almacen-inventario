package com.vcm.backend.service.impl;

import com.vcm.backend.dto.request.OperacionRequest;
import com.vcm.backend.dto.response.OperacionResponse;
import com.vcm.backend.entity.*;
import com.vcm.backend.exception.RecursoNoEncontradoException;
import com.vcm.backend.exception.ReglaNegocioException;
import com.vcm.backend.repository.*;
import com.vcm.backend.service.OperacionService;
import com.vcm.backend.strategy.ContextoOperacion;
import com.vcm.backend.strategy.OperacionStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.vcm.backend.enums.EstadoOperacion;
import com.vcm.backend.enums.TipoMovimiento;
import com.vcm.backend.enums.TipoOperacion;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class OperacionServiceImpl implements OperacionService {

    private final MovimientoRepository movimientoRepo;
    private final OperacionRepository operacionRepo;
    private final SecuenciaOperacionRepository secuenciaRepo;
    private final MotivoOperacionRepository motivoRepo;
    private final TipoDocumentoRepository tipoDocumentoRepo;
    private final AlmacenRepository almacenRepo;
    private final AreaRepository areaRepo;
    private final PersonalRepository personalRepo;
    private final MaterialRepository materialRepo;
    private final UsuarioRepository usuarioRepo;
    private final List<OperacionStrategy> estrategias;   // Spring inyecta todas las estrategias

    @Override
    @Transactional
    public OperacionResponse registrar(OperacionRequest r, String username) {
        OperacionStrategy estrategia = estrategias.stream()
                .filter(e -> e.tipo() == r.tipo())
                .findFirst()
                .orElseThrow(() -> new ReglaNegocioException(
                        "El registro de operaciones de tipo " + r.tipo() + " aún no está disponible"));

        estrategia.validar(r);
        // RF12: fuera de los ajustes (donde 0 es un conteo válido) la cantidad debe ser mayor que cero
        if (r.tipo() != TipoOperacion.AJUSTE) {
            for (OperacionRequest.ItemRequest item : r.items()) {
                if (item.cantidad().signum() <= 0) {
                    throw new ReglaNegocioException("La cantidad debe ser mayor que cero");
                }
            }
        }

        Usuario usuario = usuarioRepo.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado: " + username));

        MotivoOperacion motivo = motivoRepo.findById(r.motivoId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Motivo no encontrado: " + r.motivoId()));
        if (!motivo.isActivo() || motivo.getTipoOperacion() != r.tipo()) {
            throw new ReglaNegocioException("El motivo '" + motivo.getNombre()
                    + "' no corresponde a una operación de tipo " + r.tipo());
        }

        // Documento obligatorio (en los ajustes ese campo guarda el acta, y se valida aparte)
        TipoDocumento tipoDocumento = null;
        if (r.tipo() != com.vcm.backend.enums.TipoOperacion.AJUSTE) {
            if (r.tipoDocumentoId() == null) {
                throw new ReglaNegocioException("El tipo de documento es obligatorio");
            }
            if (r.numeroDocumento() == null || r.numeroDocumento().isBlank()) {
                throw new ReglaNegocioException("El número de documento es obligatorio");
            }
        }
        if (r.tipoDocumentoId() != null) {
            tipoDocumento = tipoDocumentoRepo.findById(r.tipoDocumentoId())
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "Tipo de documento no encontrado: " + r.tipoDocumentoId()));
        }

        Almacen almacen = buscarAlmacen(r.almacenId());
        Almacen destino = r.almacenDestinoId() == null ? null : buscarAlmacen(r.almacenDestinoId());

        Area area = r.areaId() == null ? null : areaRepo.findById(r.areaId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Área no encontrada: " + r.areaId()));
        Personal receptor = r.receptorId() == null ? null : personalRepo.findById(r.receptorId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Persona no encontrada: " + r.receptorId()));

        // Materiales: existen, están activos y no se repiten
        Map<Long, Material> materiales = new LinkedHashMap<>();
        Set<Long> vistos = new HashSet<>();
        for (OperacionRequest.ItemRequest item : r.items()) {
            if (!vistos.add(item.materialId())) {
                throw new ReglaNegocioException("El material con id " + item.materialId()
                        + " está repetido; usa una sola línea con la cantidad total");
            }
            Material material = materialRepo.findById(item.materialId())
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "Material no encontrado: " + item.materialId()));
            if (!material.isActivo()) {
                throw new ReglaNegocioException("El material " + material.getCodigo() + " está desactivado");
            }
            materiales.put(material.getId(), material);
        }

        List<Movimiento> movimientos = estrategia.generarMovimientos(
                r, new ContextoOperacion(almacen, destino, materiales));

        // Numeración propia por tipo: la fila se bloquea hasta que termine la transacción
        SecuenciaOperacion secuencia = secuenciaRepo.bloquearPorTipo(r.tipo())
                .orElseThrow(() -> new IllegalStateException("Falta la secuencia de " + r.tipo()));
        secuencia.setUltimoNumero(secuencia.getUltimoNumero() + 1);

        Operacion operacion = new Operacion();
        operacion.setTipo(r.tipo());
        operacion.setNumero(secuencia.getUltimoNumero());
        operacion.setFecha(r.fecha());
        operacion.setMotivo(motivo);
        operacion.setTipoDocumento(tipoDocumento);
        operacion.setSerie(limpiar(r.serie(), true));
        operacion.setNumeroDocumento(limpiar(r.numeroDocumento(), true));
        operacion.setArea(area);
        operacion.setReceptor(receptor);
        operacion.setObservaciones(limpiar(r.observaciones(), false));
        operacion.setUsuario(usuario);
        movimientos.forEach(operacion::agregarMovimiento);

        return OperacionResponse.de(operacionRepo.save(operacion));
    }

    @Override
    @Transactional(readOnly = true)
    public OperacionResponse obtener(Long id) {
        return OperacionResponse.de(operacionRepo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Operación no encontrada: " + id)));
    }
    @Override
    @Transactional(readOnly = true)
    public List<OperacionResponse> listar(TipoOperacion tipo, Long almacenId, LocalDate desde, LocalDate hasta,
                                          EstadoOperacion estado, String q, int limite) {
        if (desde != null && hasta != null && desde.isAfter(hasta)) {
            throw new ReglaNegocioException("La fecha 'desde' no puede ser posterior a 'hasta'");
        }
        int tope = Math.min(Math.max(limite, 1), 500);
        Sort orden = Sort.by(Sort.Order.desc("fecha"), Sort.Order.desc("id"));
        return operacionRepo
                .findAll(OperacionSpecs.filtrar(tipo, almacenId, desde, hasta, estado, q),
                        PageRequest.of(0, tope, orden))
                .getContent().stream().map(OperacionResponse::de).toList();
    }

    @Override
    @Transactional
    public OperacionResponse anular(Long id) {
        Operacion operacion = operacionRepo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Operación no encontrada: " + id));
        if (operacion.getEstado() == EstadoOperacion.ANULADA) {
            throw new ReglaNegocioException("La operación ya está anulada");
        }

        // Efecto neto de la operación por material y almacén (aumento +, disminución -)
        Map<String, BigDecimal> neto = new LinkedHashMap<>();
        Map<String, Movimiento> referencia = new LinkedHashMap<>();
        for (Movimiento m : operacion.getMovimientos()) {
            String clave = m.getMaterial().getId() + ":" + m.getAlmacen().getId();
            BigDecimal firmado = m.getTipo() == TipoMovimiento.AUMENTO ? m.getCantidad() : m.getCantidad().negate();
            neto.merge(clave, firmado, BigDecimal::add);
            referencia.putIfAbsent(clave, m);
        }

        // Al anular se revierte ese efecto: el stock resultante no puede quedar negativo
        for (Map.Entry<String, BigDecimal> e : neto.entrySet()) {
            Movimiento m = referencia.get(e.getKey());
            BigDecimal actual = movimientoRepo.stockDisponible(m.getMaterial().getId(), m.getAlmacen().getId());
            BigDecimal resultante = actual.subtract(e.getValue());
            if (resultante.signum() < 0) {
                throw new ReglaNegocioException("No se puede anular: el stock de " + m.getMaterial().getCodigo()
                        + " en " + m.getAlmacen().getNombre() + " quedaría en "
                        + resultante.stripTrailingZeros().toPlainString()
                        + " (parte de ese material ya fue utilizado)");
            }
        }

        operacion.setEstado(EstadoOperacion.ANULADA);
        return OperacionResponse.de(operacion);
    }

    private Almacen buscarAlmacen(Long id) {
        Almacen almacen = almacenRepo.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Almacén no encontrado: " + id));
        if (!almacen.isActivo()) {
            throw new ReglaNegocioException("El almacén " + almacen.getNombre() + " está desactivado");
        }
        return almacen;
    }

    // Quita espacios; si "mayusculas" es true también pasa a mayúsculas. Texto vacío = null
    private String limpiar(String texto, boolean mayusculas) {
        if (texto == null || texto.isBlank()) {
            return null;
        }
        String limpio = texto.trim();
        return mayusculas ? limpio.toUpperCase() : limpio;
    }
}
