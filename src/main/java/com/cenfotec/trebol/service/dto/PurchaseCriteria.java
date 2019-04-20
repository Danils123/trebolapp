package com.cenfotec.trebol.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the Purchase entity. This class is used in PurchaseResource to
 * receive all the possible filtering options from the Http GET request parameters.
 * For example the following could be a valid requests:
 * <code> /purchases?id.greaterThan=5&amp;attr1.contains=something&amp;attr2.specified=false</code>
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class PurchaseCriteria implements Serializable {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter state;

    private BooleanFilter homeDelivery;

    private LongFilter paymentId;

    private LongFilter orderId;

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getState() {
        return state;
    }

    public void setState(StringFilter state) {
        this.state = state;
    }

    public BooleanFilter getHomeDelivery() {
        return homeDelivery;
    }

    public void setHomeDelivery(BooleanFilter homeDelivery) {
        this.homeDelivery = homeDelivery;
    }

    public LongFilter getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(LongFilter paymentId) {
        this.paymentId = paymentId;
    }

    public LongFilter getOrderId() {
        return orderId;
    }

    public void setOrderId(LongFilter orderId) {
        this.orderId = orderId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final PurchaseCriteria that = (PurchaseCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(state, that.state) &&
            Objects.equals(homeDelivery, that.homeDelivery) &&
            Objects.equals(paymentId, that.paymentId) &&
            Objects.equals(orderId, that.orderId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        state,
        homeDelivery,
        paymentId,
        orderId
        );
    }

    @Override
    public String toString() {
        return "PurchaseCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (state != null ? "state=" + state + ", " : "") +
                (homeDelivery != null ? "homeDelivery=" + homeDelivery + ", " : "") +
                (paymentId != null ? "paymentId=" + paymentId + ", " : "") +
                (orderId != null ? "orderId=" + orderId + ", " : "") +
            "}";
    }

}
