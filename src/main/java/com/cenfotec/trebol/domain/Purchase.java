package com.cenfotec.trebol.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Purchase.
 */
@Entity
@Table(name = "purchase")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Purchase implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "state", nullable = false)
    private String state;

    @NotNull
    @Column(name = "home_delivery", nullable = false)
    private Boolean homeDelivery;

    
    @Column(name = "payment_id", unique = true)
    private Long paymentId;

    
    @Column(name = "order_id", unique = true)
    private Long orderId;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getState() {
        return state;
    }

    public Purchase state(String state) {
        this.state = state;
        return this;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Boolean isHomeDelivery() {
        return homeDelivery;
    }

    public Purchase homeDelivery(Boolean homeDelivery) {
        this.homeDelivery = homeDelivery;
        return this;
    }

    public void setHomeDelivery(Boolean homeDelivery) {
        this.homeDelivery = homeDelivery;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public Purchase paymentId(Long paymentId) {
        this.paymentId = paymentId;
        return this;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public Purchase orderId(Long orderId) {
        this.orderId = orderId;
        return this;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
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
        Purchase purchase = (Purchase) o;
        if (purchase.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), purchase.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Purchase{" +
            "id=" + getId() +
            ", state='" + getState() + "'" +
            ", homeDelivery='" + isHomeDelivery() + "'" +
            ", paymentId=" + getPaymentId() +
            ", orderId=" + getOrderId() +
            "}";
    }
}
