package com.cenfotec.trebol.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A ProductList.
 */
@Entity
@Table(name = "product_list")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ProductList implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "state")
    private Boolean state;

    @OneToMany(mappedBy = "productList")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ListSchedule> listSchedules = new HashSet<>();
    @ManyToMany(mappedBy = "productLists")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<ProductCommerce> productCommerces = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isState() {
        return state;
    }

    public ProductList state(Boolean state) {
        this.state = state;
        return this;
    }

    public void setState(Boolean state) {
        this.state = state;
    }

    public Set<ListSchedule> getListSchedules() {
        return listSchedules;
    }

    public ProductList listSchedules(Set<ListSchedule> listSchedules) {
        this.listSchedules = listSchedules;
        return this;
    }

    public ProductList addListSchedule(ListSchedule listSchedule) {
        this.listSchedules.add(listSchedule);
        listSchedule.setProductList(this);
        return this;
    }

    public ProductList removeListSchedule(ListSchedule listSchedule) {
        this.listSchedules.remove(listSchedule);
        listSchedule.setProductList(null);
        return this;
    }

    public void setListSchedules(Set<ListSchedule> listSchedules) {
        this.listSchedules = listSchedules;
    }

    public Set<ProductCommerce> getProductCommerces() {
        return productCommerces;
    }

    public ProductList productCommerces(Set<ProductCommerce> productCommerces) {
        this.productCommerces = productCommerces;
        return this;
    }

    public ProductList addProductCommerce(ProductCommerce productCommerce) {
        this.productCommerces.add(productCommerce);
        productCommerce.getProductLists().add(this);
        return this;
    }

    public ProductList removeProductCommerce(ProductCommerce productCommerce) {
        this.productCommerces.remove(productCommerce);
        productCommerce.getProductLists().remove(this);
        return this;
    }

    public void setProductCommerces(Set<ProductCommerce> productCommerces) {
        this.productCommerces = productCommerces;
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
        ProductList productList = (ProductList) o;
        if (productList.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productList.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductList{" +
            "id=" + getId() +
            ", state='" + isState() + "'" +
            "}";
    }
}
