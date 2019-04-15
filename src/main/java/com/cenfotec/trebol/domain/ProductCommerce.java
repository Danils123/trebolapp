package com.cenfotec.trebol.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A ProductCommerce.
 */
@Entity
@Table(name = "product_commerce")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ProductCommerce implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "price")
    private Float price;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "commerce_id")
    private Long commerce_id;

    @ManyToOne
    @JsonIgnoreProperties("productCommerces")
    private Product product;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "product_commerce_product_list",
               joinColumns = @JoinColumn(name = "product_commerce_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "product_list_id", referencedColumnName = "id"))
    private Set<ProductList> productLists = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getPrice() {
        return price;
    }

    public ProductCommerce price(Float price) {
        this.price = price;
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ProductCommerce quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Long getCommerce_id() {
        return commerce_id;
    }

    public ProductCommerce commerce_id(Long commerce_id) {
        this.commerce_id = commerce_id;
        return this;
    }

    public void setCommerce_id(Long commerce_id) {
        this.commerce_id = commerce_id;
    }

    public Product getProduct() {
        return product;
    }

    public ProductCommerce product(Product product) {
        this.product = product;
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Set<ProductList> getProductLists() {
        return productLists;
    }

    public ProductCommerce productLists(Set<ProductList> productLists) {
        this.productLists = productLists;
        return this;
    }

    public ProductCommerce addProductList(ProductList productList) {
        this.productLists.add(productList);
        productList.getProductCommerces().add(this);
        return this;
    }

    public ProductCommerce removeProductList(ProductList productList) {
        this.productLists.remove(productList);
        productList.getProductCommerces().remove(this);
        return this;
    }

    public void setProductLists(Set<ProductList> productLists) {
        this.productLists = productLists;
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
        ProductCommerce productCommerce = (ProductCommerce) o;
        if (productCommerce.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), productCommerce.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ProductCommerce{" +
            "id=" + getId() +
            ", price=" + getPrice() +
            ", quantity=" + getQuantity() +
            ", commerce_id=" + getCommerce_id() +
            "}";
    }
}
