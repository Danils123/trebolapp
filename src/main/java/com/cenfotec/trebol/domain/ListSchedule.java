package com.cenfotec.trebol.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A ListSchedule.
 */
@Entity
@Table(name = "list_schedule")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ListSchedule implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "day")
    private String day;

    @Column(name = "jhi_time")
    private Instant time;

    @Column(name = "state")
    private Boolean state;

    @Column (name = "recurrent")
    private Boolean recurrent;

    @Column (name = "purchaseid")
    private Long purchaseid;

    @ManyToOne
    @JsonIgnoreProperties("listSchedules")
    private ProductList productList;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDay() {
        return day;
    }

    public ListSchedule day(String day) {
        this.day = day;
        return this;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public Instant getTime() {
        return time;
    }

    public ListSchedule time(Instant time) {
        this.time = time;
        return this;
    }

    public void setTime(Instant time) {
        this.time = time;
    }

    public Boolean isState() {
        return state;
    }

    public ListSchedule state(Boolean state) {
        this.state = state;
        return this;
    }

    public void setState(Boolean state) {
        this.state = state;
    }

    public ProductList getProductList() {
        return productList;
    }

    public ListSchedule productList(ProductList productList) {
        this.productList = productList;
        return this;
    }

    public void setProductList(ProductList productList) {
        this.productList = productList;
    }

    public Boolean getRecurrent() {
        return recurrent;
    }

    public void setRecurrent(Boolean recurrent) {
        this.recurrent = recurrent;
    }

    public Long getPurchaseid() {
        return purchaseid;
    }

    public void setPurchase_id(Long purchaseid) {
        this.purchaseid = purchaseid;
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
        ListSchedule listSchedule = (ListSchedule) o;
        if (listSchedule.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), listSchedule.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ListSchedule{" +
            "id=" + getId() +
            ", day='" + getDay() + "'" +
            ", time='" + getTime() + "'" +
            ", state='" + isState() + "'" +
            "}";
    }
}
