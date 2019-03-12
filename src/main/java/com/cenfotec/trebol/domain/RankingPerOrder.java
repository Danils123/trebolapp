package com.cenfotec.trebol.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A RankingPerOrder.
 */
@Entity
@Table(name = "ranking_per_order")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class RankingPerOrder implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "comment_from_buyer")
    private String commentFromBuyer;

    @Column(name = "comment_from_seller")
    private String commentFromSeller;

    @Column(name = "ranking")
    private Integer ranking;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "ranking_per_order_buyer",
               joinColumns = @JoinColumn(name = "ranking_per_order_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "buyer_id", referencedColumnName = "id"))
    private Set<UserExtra> buyers = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "ranking_per_order_seller",
               joinColumns = @JoinColumn(name = "ranking_per_order_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "seller_id", referencedColumnName = "id"))
    private Set<UserExtra> sellers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCommentFromBuyer() {
        return commentFromBuyer;
    }

    public RankingPerOrder commentFromBuyer(String commentFromBuyer) {
        this.commentFromBuyer = commentFromBuyer;
        return this;
    }

    public void setCommentFromBuyer(String commentFromBuyer) {
        this.commentFromBuyer = commentFromBuyer;
    }

    public String getCommentFromSeller() {
        return commentFromSeller;
    }

    public RankingPerOrder commentFromSeller(String commentFromSeller) {
        this.commentFromSeller = commentFromSeller;
        return this;
    }

    public void setCommentFromSeller(String commentFromSeller) {
        this.commentFromSeller = commentFromSeller;
    }

    public Integer getRanking() {
        return ranking;
    }

    public RankingPerOrder ranking(Integer ranking) {
        this.ranking = ranking;
        return this;
    }

    public void setRanking(Integer ranking) {
        this.ranking = ranking;
    }

    public Set<UserExtra> getBuyers() {
        return buyers;
    }

    public RankingPerOrder buyers(Set<UserExtra> userExtras) {
        this.buyers = userExtras;
        return this;
    }

    public RankingPerOrder addBuyer(UserExtra userExtra) {
        this.buyers.add(userExtra);
        userExtra.getOrderBuyers().add(this);
        return this;
    }

    public RankingPerOrder removeBuyer(UserExtra userExtra) {
        this.buyers.remove(userExtra);
        userExtra.getOrderBuyers().remove(this);
        return this;
    }

    public void setBuyers(Set<UserExtra> userExtras) {
        this.buyers = userExtras;
    }

    public Set<UserExtra> getSellers() {
        return sellers;
    }

    public RankingPerOrder sellers(Set<UserExtra> userExtras) {
        this.sellers = userExtras;
        return this;
    }

    public RankingPerOrder addSeller(UserExtra userExtra) {
        this.sellers.add(userExtra);
        userExtra.getOrderSellers().add(this);
        return this;
    }

    public RankingPerOrder removeSeller(UserExtra userExtra) {
        this.sellers.remove(userExtra);
        userExtra.getOrderSellers().remove(this);
        return this;
    }

    public void setSellers(Set<UserExtra> userExtras) {
        this.sellers = userExtras;
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
        RankingPerOrder rankingPerOrder = (RankingPerOrder) o;
        if (rankingPerOrder.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), rankingPerOrder.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "RankingPerOrder{" +
            "id=" + getId() +
            ", commentFromBuyer='" + getCommentFromBuyer() + "'" +
            ", commentFromSeller='" + getCommentFromSeller() + "'" +
            ", ranking=" + getRanking() +
            "}";
    }
}
