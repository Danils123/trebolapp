package com.cenfotec.trebol.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A ProductsPerOrder.
 */
@Entity
@Table(name = "products_per_order")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ProductsPerOrder implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "quantity")
    private Integer quantity;

    @ManyToOne
    @JsonIgnoreProperties("productsPerOrders")
    private ProductCommerce productCommerce;

    @ManyToOne
    @JsonIgnoreProperties("productsPerOrders")
    private OrderItem orderItem;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ProductsPerOrder quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public ProductCommerce getProductCommerce() {
        return productCommerce;
    }

    public ProductsPerOrder productCommerce(ProductCommerce productCommerce) {
        this.productCommerce = productCommerce;
        return this;
    }

    public void setProductCommerce(ProductCommerce productCommerce) {
        this.productCommerce = productCommerce;
    }

    public OrderItem getOrderItem() {
        return orderItem;
    }

    public ProductsPerOrder orderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
        return this;
    }

    public void setOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
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
        ProductsPerOrder productsPerOrder = (ProductsPerOrder) o;
        if (productsPerOrder.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productsPerOrder.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductsPerOrder{" +
            "id=" + getId() +
            ", quantity=" + getQuantity() +
            "}";
    }
}
