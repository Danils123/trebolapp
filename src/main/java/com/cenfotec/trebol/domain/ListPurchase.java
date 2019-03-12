package com.cenfotec.trebol.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A ListPurchase.
 */
@Entity
@Table(name = "list_purchase")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ListPurchase implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "state")
    private Boolean state;

    @OneToOne
    @JoinColumn(unique = true)
    private ProductList productList;

    @ManyToOne
    @JsonIgnoreProperties("listPurchases")
    private UserExtra seller;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public ListPurchase name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public ListPurchase description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean isState() {
        return state;
    }

    public ListPurchase state(Boolean state) {
        this.state = state;
        return this;
    }

    public void setState(Boolean state) {
        this.state = state;
    }

    public ProductList getProductList() {
        return productList;
    }

    public ListPurchase productList(ProductList productList) {
        this.productList = productList;
        return this;
    }

    public void setProductList(ProductList productList) {
        this.productList = productList;
    }

    public UserExtra getSeller() {
        return seller;
    }

    public ListPurchase seller(UserExtra userExtra) {
        this.seller = userExtra;
        return this;
    }

    public void setSeller(UserExtra userExtra) {
        this.seller = userExtra;
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
        ListPurchase listPurchase = (ListPurchase) o;
        if (listPurchase.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), listPurchase.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ListPurchase{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", state='" + isState() + "'" +
            "}";
    }
}
