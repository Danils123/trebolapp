package com.cenfotec.trebol.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import io.github.jhipster.config.jcache.BeanClassLoaderAwareJCacheRegionFactory;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        BeanClassLoaderAwareJCacheRegionFactory.setBeanClassLoader(this.getClass().getClassLoader());
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache(com.cenfotec.trebol.repository.UserRepository.USERS_BY_LOGIN_CACHE, jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.repository.UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.PersistentToken.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.User.class.getName() + ".persistentTokens", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.RankingPerOrder.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.RankingPerOrder.class.getName() + ".buyers", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.RankingPerOrder.class.getName() + ".sellers", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.PointsCommerce.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Category.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Category.class.getName() + ".products", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.SubCategory.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.SubCategory.class.getName() + ".products", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Product.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Product.class.getName() + ".productCommerces", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.ProductCommerce.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.ProductCommerce.class.getName() + ".commerce", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.ProductCommerce.class.getName() + ".productLists", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.ListPurchase.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.ProductList.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.ProductList.class.getName() + ".listSchedules", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.ProductList.class.getName() + ".productCommerces", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.ProductsPerOrder.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.OrderItem.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.OrderItem.class.getName() + ".productsPerOrders", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.ListSchedule.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.ParametersCommerce.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Commerce.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Commerce.class.getName() + ".orderItems", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Commerce.class.getName() + ".parametersCommerces", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Commerce.class.getName() + ".scheduleCommerces", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.ScheduleCommerce.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Offer.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Offer.class.getName() + ".orderItems", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.UserExtra.class.getName(), jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.UserExtra.class.getName() + ".commerces", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.UserExtra.class.getName() + ".orders", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.UserExtra.class.getName() + ".orderBuyers", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.UserExtra.class.getName() + ".orderSellers", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.Commerce.class.getName() + ".productCommerces", jcacheConfiguration);
            cm.createCache(com.cenfotec.trebol.domain.CommerceUser.class.getName(), jcacheConfiguration);
            // jhipster-needle-ehcache-add-entry
        };
    }
}
