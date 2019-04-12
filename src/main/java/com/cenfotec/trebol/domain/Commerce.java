package com.cenfotec.trebol.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Commerce.
 */
@Entity
@Table(name = "commerce")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Commerce implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "identification")
    private Long identification;

    @Column(name = "name")
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "latitude")
    private Float latitude;

    @Column(name = "longitud")
    private Float longitud;

    @Column(name = "email")
    private String email;

    @Column(name = "ranking")
    private Float ranking;

    @Column(name = "photograph")
    private String photograph;

    @Column(name = "state")
    private Boolean state;

    @Column(name = "phone")
    private String phone;

    @OneToMany(mappedBy = "commerce")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<OrderItem> orderItems = new HashSet<>();
    @OneToMany(mappedBy = "commerce")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ParametersCommerce> parametersCommerces = new HashSet<>();
    @OneToMany(mappedBy = "commerce")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ScheduleCommerce> scheduleCommerces = new HashSet<>();
    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private UserExtra owner;

    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private UserExtra userExtra;

    @ManyToMany(mappedBy = "commerces")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Offer> offers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdentification() {
        return identification;
    }

    public Commerce identification(Long identification) {
        this.identification = identification;
        return this;
    }

    public void setIdentification(Long identification) {
        this.identification = identification;
    }

    public String getName() {
        return name;
    }

    public Commerce name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public Commerce address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Float getLatitude() {
        return latitude;
    }

    public Commerce latitude(Float latitude) {
        this.latitude = latitude;
        return this;
    }

    public void setLatitude(Float latitude) {
        this.latitude = latitude;
    }

    public Float getLongitud() {
        return longitud;
    }

    public Commerce longitud(Float longitud) {
        this.longitud = longitud;
        return this;
    }

    public void setLongitud(Float longitud) {
        this.longitud = longitud;
    }

    public String getEmail() {
        return email;
    }

    public Commerce email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Float getRanking() {
        return ranking;
    }

    public Commerce ranking(Float ranking) {
        this.ranking = ranking;
        return this;
    }

    public void setRanking(Float ranking) {
        this.ranking = ranking;
    }

    public String getPhotograph() {
        return photograph;
    }

    public Commerce photograph(String photograph) {
        this.photograph = photograph;
        return this;
    }

    public void setPhotograph(String photograph) {
        this.photograph = photograph;
    }

    public Boolean isState() {
        return state;
    }

    public Commerce state(Boolean state) {
        this.state = state;
        return this;
    }

    public void setState(Boolean state) {
        this.state = state;
    }

    public String getPhone() {
        return phone;
    }

    public Commerce phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<OrderItem> getOrderItems() {
        return orderItems;
    }

    public Commerce orderItems(Set<OrderItem> orderItems) {
        this.orderItems = orderItems;
        return this;
    }

    public Commerce addOrderItem(OrderItem orderItem) {
        this.orderItems.add(orderItem);
        orderItem.setCommerce(this);
        return this;
    }

    public Commerce removeOrderItem(OrderItem orderItem) {
        this.orderItems.remove(orderItem);
        orderItem.setCommerce(null);
        return this;
    }

    public void setOrderItems(Set<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public Set<ParametersCommerce> getParametersCommerces() {
        return parametersCommerces;
    }

    public Commerce parametersCommerces(Set<ParametersCommerce> parametersCommerces) {
        this.parametersCommerces = parametersCommerces;
        return this;
    }

    public Commerce addParametersCommerce(ParametersCommerce parametersCommerce) {
        this.parametersCommerces.add(parametersCommerce);
        parametersCommerce.setCommerce(this);
        return this;
    }

    public Commerce removeParametersCommerce(ParametersCommerce parametersCommerce) {
        this.parametersCommerces.remove(parametersCommerce);
        parametersCommerce.setCommerce(null);
        return this;
    }

    public void setParametersCommerces(Set<ParametersCommerce> parametersCommerces) {
        this.parametersCommerces = parametersCommerces;
    }

    public Set<ScheduleCommerce> getScheduleCommerces() {
        return scheduleCommerces;
    }

    public Commerce scheduleCommerces(Set<ScheduleCommerce> scheduleCommerces) {
        this.scheduleCommerces = scheduleCommerces;
        return this;
    }

    public Commerce addScheduleCommerce(ScheduleCommerce scheduleCommerce) {
        this.scheduleCommerces.add(scheduleCommerce);
        scheduleCommerce.setCommerce(this);
        return this;
    }

    public Commerce removeScheduleCommerce(ScheduleCommerce scheduleCommerce) {
        this.scheduleCommerces.remove(scheduleCommerce);
        scheduleCommerce.setCommerce(null);
        return this;
    }

    public void setScheduleCommerces(Set<ScheduleCommerce> scheduleCommerces) {
        this.scheduleCommerces = scheduleCommerces;
    }

    public UserExtra getOwner() {
        return owner;
    }

    public Commerce owner(UserExtra userExtra) {
        this.owner = userExtra;
        return this;
    }

    public void setOwner(UserExtra userExtra) {
        this.owner = userExtra;
    }

    public UserExtra getUserExtra() {
        return userExtra;
    }

    public Commerce userExtra(UserExtra userExtra) {
        this.userExtra = userExtra;
        return this;
    }

    public void setUserExtra(UserExtra userExtra) {
        this.userExtra = userExtra;
    }
<<<<<<< HEAD

    public Set<Offer> getOffers() {
        return offers;
    }

    public Commerce offers(Set<Offer> offers) {
        this.offers = offers;
        return this;
    }

    public Commerce addOffers(Offer offer) {
        this.offers.add(offer);
        offer.getCommerces().add(this);
        return this;
    }

    public Commerce removeOffers(Offer offer) {
        this.offers.remove(offer);
        offer.getCommerces().remove(this);
        return this;
    }

    public void setOffers(Set<Offer> offers) {
        this.offers = offers;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove
=======
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here, do not remove
>>>>>>> b7389b9b66cecc5d94a88b17ef881dbdd1e0d370

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Commerce commerce = (Commerce) o;
        if (commerce.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), commerce.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Commerce{" + "id=" + getId() + ", identification=" + getIdentification() + ", name='" + getName() + "'"
                + ", address='" + getAddress() + "'" + ", latitude=" + getLatitude() + ", longitud=" + getLongitud()
                + ", email='" + getEmail() + "'" + ", ranking=" + getRanking() + ", photograph='" + getPhotograph()
                + "'" + ", state='" + isState() + "'" + ", phone='" + getPhone() + "'" + "}";
    }
}
