package com.cenfotec.trebol.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Offer.
 */
@Entity
@Table(name = "offer")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Offer implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "discount")
    private Float discount;

    @Column(name = "description")
    private String description;

    @Column(name = "jhi_type")
    private Integer type;

    @Column(name = "expiration_date")
    private ZonedDateTime expirationDate;

    @Column(name = "disabled")
    private Boolean disabled;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "offer_commerces",
               joinColumns = @JoinColumn(name = "offer_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "commerces_id", referencedColumnName = "id"))
    private Set<Commerce> commerces = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getDiscount() {
        return discount;
    }

    public Offer discount(Float discount) {
        this.discount = discount;
        return this;
    }

    public void setDiscount(Float discount) {
        this.discount = discount;
    }

    public String getDescription() {
        return description;
    }

    public Offer description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getType() {
        return type;
    }

    public Offer type(Integer type) {
        this.type = type;
        return this;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public ZonedDateTime getExpirationDate() {
        return expirationDate;
    }

    public Offer expirationDate(ZonedDateTime expirationDate) {
        this.expirationDate = expirationDate;
        return this;
    }

    public void setExpirationDate(ZonedDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public Boolean isDisabled() {
        return disabled;
    }

    public Offer disabled(Boolean disabled) {
        this.disabled = disabled;
        return this;
    }

    public void setDisabled(Boolean disabled) {
        this.disabled = disabled;
    }

    public Set<Commerce> getCommerces() {
        return commerces;
    }

    public Offer commerces(Set<Commerce> commerce) {
        this.commerces = commerce;
        return this;
    }

    public Offer addCommerces(Commerce commerce) {
        this.commerces.add(commerce);
        commerce.getOffers().add(this);
        return this;
    }

    public Offer removeCommerces(Commerce commerce) {
        this.commerces.remove(commerce);
        commerce.getOffers().remove(this);
        return this;
    }

    public void setCommerces(Set<Commerce> commerce) {
        this.commerces = commerce;
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
        Offer offer = (Offer) o;
        if (offer.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), offer.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Offer{" +
            "id=" + getId() +
            ", discount=" + getDiscount() +
            ", description='" + getDescription() + "'" +
            ", type=" + getType() +
            ", expirationDate='" + getExpirationDate() + "'" +
            ", disabled='" + isDisabled() + "'" +
            "}";
    }
}
