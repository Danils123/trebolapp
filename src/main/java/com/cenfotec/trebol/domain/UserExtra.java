package com.cenfotec.trebol.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A UserExtra.
 */
@Entity
@Table(name = "user_extra")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class UserExtra implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "second_last_name")
    private String secondLastName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "cell_phone")
    private String cellPhone;

    @Column(name = "address")
    private String address;

    @Column(name = "ranking")
    private String ranking;

    @Column(name = "photograph")
    private String photograph;

    @Column(name = "notification")
    private String notification;

    @Column(name = "userId")
    private Long userId;

    @OneToMany(mappedBy = "userExtra", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Commerce> commerces = new HashSet<>();
    @ManyToMany(mappedBy = "buyers")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<RankingPerOrder> orderBuyers = new HashSet<>();

    @ManyToMany(mappedBy = "sellers")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<RankingPerOrder> orderSellers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not
    // remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSecondLastName() {
        return secondLastName;
    }

    public UserExtra secondLastName(String secondLastName) {
        this.secondLastName = secondLastName;
        return this;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setSecondLastName(String secondLastName) {
        this.secondLastName = secondLastName;
    }

    public String getPhone() {
        return phone;
    }

    public UserExtra phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCellPhone() {
        return cellPhone;
    }

    public UserExtra cellPhone(String cellPhone) {
        this.cellPhone = cellPhone;
        return this;
    }

    public void setCellPhone(String cellPhone) {
        this.cellPhone = cellPhone;
    }

    public String getAddress() {
        return address;
    }

    public UserExtra address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRanking() {
        return ranking;
    }

    public UserExtra ranking(String ranking) {
        this.ranking = ranking;
        return this;
    }

    public void setRanking(String ranking) {
        this.ranking = ranking;
    }

    public String getPhotograph() {
        return photograph;
    }

    public UserExtra photograph(String photograph) {
        this.photograph = photograph;
        return this;
    }

    public void setPhotograph(String photograph) {
        this.photograph = photograph;
    }

    public String getNotification() {
        return notification;
    }

    public UserExtra notification(String notification) {
        this.notification = notification;
        return this;
    }

    public void setNotification(String notification) {
        this.notification = notification;
    }

    public Set<Commerce> getCommerces() {
        return commerces;
    }

    public UserExtra commerces(Set<Commerce> commerce) {
        this.commerces = commerce;
        return this;
    }

    public UserExtra addCommerces(Commerce commerce) {
        this.commerces.add(commerce);
        commerce.setUserExtra(this);
        return this;
    }

    public UserExtra removeCommerces(Commerce commerce) {
        this.commerces.remove(commerce);
        commerce.setUserExtra(null);
        return this;
    }

    public void setCommerces(Set<Commerce> commerce) {
        this.commerces = commerce;
    }

    public Set<RankingPerOrder> getOrderBuyers() {
        return orderBuyers;
    }

    public UserExtra orderBuyers(Set<RankingPerOrder> rankingPerOrders) {
        this.orderBuyers = rankingPerOrders;
        return this;
    }

    public UserExtra addOrderBuyer(RankingPerOrder rankingPerOrder) {
        this.orderBuyers.add(rankingPerOrder);
        rankingPerOrder.getBuyers().add(this);
        return this;
    }

    public UserExtra removeOrderBuyer(RankingPerOrder rankingPerOrder) {
        this.orderBuyers.remove(rankingPerOrder);
        rankingPerOrder.getBuyers().remove(this);
        return this;
    }

    public void setOrderBuyers(Set<RankingPerOrder> rankingPerOrders) {
        this.orderBuyers = rankingPerOrders;
    }

    public Set<RankingPerOrder> getOrderSellers() {
        return orderSellers;
    }

    public UserExtra orderSellers(Set<RankingPerOrder> rankingPerOrders) {
        this.orderSellers = rankingPerOrders;
        return this;
    }

    public UserExtra addOrderSeller(RankingPerOrder rankingPerOrder) {
        this.orderSellers.add(rankingPerOrder);
        rankingPerOrder.getSellers().add(this);
        return this;
    }

    public UserExtra removeOrderSeller(RankingPerOrder rankingPerOrder) {
        this.orderSellers.remove(rankingPerOrder);
        rankingPerOrder.getSellers().remove(this);
        return this;
    }

    public void setOrderSellers(Set<RankingPerOrder> rankingPerOrders) {
        this.orderSellers = rankingPerOrders;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserExtra userExtra = (UserExtra) o;
        if (userExtra.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), userExtra.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UserExtra{" + "id=" + getId() + ", secondLastName='" + getSecondLastName() + "'" + ", phone='"
                + getPhone() + "'" + ", cellPhone='" + getCellPhone() + "'" + ", address='" + getAddress() + "'"
                + ", ranking='" + getRanking() + "'" + ", photograph='" + getPhotograph() + "'" + ", notification='"
                + getNotification() + "'" + "}";
    }
}
