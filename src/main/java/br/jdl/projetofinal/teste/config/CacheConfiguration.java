package br.jdl.projetofinal.teste.config;

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
            cm.createCache(br.jdl.projetofinal.teste.repository.UserRepository.USERS_BY_LOGIN_CACHE, jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.repository.UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Professor.class.getName(), jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Professor.class.getName() + ".cursos", jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Curso.class.getName(), jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Curso.class.getName() + ".disciplinas", jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Curso.class.getName() + ".professors", jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Disciplina.class.getName(), jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Disciplina.class.getName() + ".cursos", jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Sala.class.getName(), jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Sala.class.getName() + ".disciplinas", jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Predio.class.getName(), jcacheConfiguration);
            cm.createCache(br.jdl.projetofinal.teste.domain.Predio.class.getName() + ".salas", jcacheConfiguration);
            // jhipster-needle-ehcache-add-entry
        };
    }
}
