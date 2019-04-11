package com.cenfotec.trebol.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A CommerceUser.
 */
@Entity
@Table(name = "commerce_user")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class CommerceUser implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "id_commerce")
    private Long idCommerce;

    @Column(name = "id_user")
    private Long idUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdCommerce() {
        return idCommerce;
    }

    public CommerceUser idCommerce(Long idCommerce) {
        this.idCommerce = idCommerce;
        return this;
    }

    public void setIdCommerce(Long idCommerce) {
        this.idCommerce = idCommerce;
    }

    public Long getIdUser() {
        return idUser;
    }

    public CommerceUser idUser(Long idUser) {
        this.idUser = idUser;
        return this;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CommerceUser commerceUser = (CommerceUser) o;
        if (commerceUser.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), commerceUser.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CommerceUser{" +
            "id=" + getId() +
            ", idCommerce=" + getIdCommerce() +
            ", idUser=" + getIdUser() +
            "}";
    }
}
