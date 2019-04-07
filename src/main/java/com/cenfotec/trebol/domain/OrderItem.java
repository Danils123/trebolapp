package com.cenfotec.trebol.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A OrderItem.
 */
@Entity
@Table(name = "order_item")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class OrderItem implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "jhi_date")
    private Instant date;

    @Column(name = "state")
    private Integer state;

    @OneToMany(mappedBy = "orderItem")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ProductsPerOrder> productsPerOrders = new HashSet<>();
    @ManyToOne
    @JsonIgnoreProperties("orderItems")
    private UserExtra seller;

    @ManyToOne
    @JsonIgnoreProperties("orderItems")
    private Commerce commerce;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public OrderItem description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDate() {
        return date;
    }

    public OrderItem date(Instant date) {
        this.date = date;
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Integer getState() {
        return state;
    }

    public OrderItem state(Integer state) {
        this.state = state;
        return this;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public Set<ProductsPerOrder> getProductsPerOrders() {
        return productsPerOrders;
    }

    public OrderItem productsPerOrders(Set<ProductsPerOrder> productsPerOrders) {
        this.productsPerOrders = productsPerOrders;
        return this;
    }

    public OrderItem addProductsPerOrder(ProductsPerOrder productsPerOrder) {
        this.productsPerOrders.add(productsPerOrder);
        productsPerOrder.setOrderItem(this);
        return this;
    }

    public OrderItem removeProductsPerOrder(ProductsPerOrder productsPerOrder) {
        this.productsPerOrders.remove(productsPerOrder);
        productsPerOrder.setOrderItem(null);
        return this;
    }

    public void setProductsPerOrders(Set<ProductsPerOrder> productsPerOrders) {
        this.productsPerOrders = productsPerOrders;
    }

    public UserExtra getSeller() {
        return seller;
    }

    public OrderItem seller(UserExtra userExtra) {
        this.seller = userExtra;
        return this;
    }

    public void setSeller(UserExtra userExtra) {
        this.seller = userExtra;
    }

    public Commerce getCommerce() {
        return commerce;
    }

    public OrderItem commerce(Commerce commerce) {
        this.commerce = commerce;
        return this;
    }

    public void setCommerce(Commerce commerce) {
        this.commerce = commerce;
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
        OrderItem orderItem = (OrderItem) o;
        if (orderItem.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), orderItem.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "OrderItem{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            ", state=" + getState() +
            "}";
    }
}
