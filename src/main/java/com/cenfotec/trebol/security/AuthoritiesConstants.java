package com.cenfotec.trebol.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    public static final String VENTA = "ROLE_VENDEDOR";

    public static final String COMPRA = "ROLE_COMPRADOR";

    public static final String ENTREGA = "ROLE_ENTREGA";

    private AuthoritiesConstants() {
    }
}
