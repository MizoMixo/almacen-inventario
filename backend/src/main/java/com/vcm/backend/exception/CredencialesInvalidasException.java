package com.vcm.backend.exception;

public class CredencialesInvalidasException extends RuntimeException {
    public CredencialesInvalidasException() {
        super("Usuario o contraseña incorrectos.");
    }
}
