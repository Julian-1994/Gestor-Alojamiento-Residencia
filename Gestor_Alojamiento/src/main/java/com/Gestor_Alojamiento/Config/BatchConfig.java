package com.Gestor_Alojamiento.Config;

import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Model.Persona;
import com.Gestor_Alojamiento.Repositorios.PersonaRepository;
import com.Gestor_Alojamiento.Repositorios.ReservaRepository;
import com.Gestor_Alojamiento.Batch.PersonaItemWriter;
import com.Gestor_Alojamiento.Batch.ReservaItemReader;
import com.Gestor_Alojamiento.Batch.ReservaItemWriter;
import com.Gestor_Alojamiento.Batch.PersonaItemReader;
import org.springframework.batch.core.*;
import org.springframework.batch.core.configuration.annotation.*;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.*;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@EnableBatchProcessing
public class BatchConfig {

    @Bean
    public ItemReader<Persona> personaItemReader(PersonaRepository personaRepository, ReservaRepository reservaRepository) {
        return new PersonaItemReader(personaRepository, reservaRepository);
    }

    @Bean
    public ItemWriter<Persona> personaItemWriter() {
        return new PersonaItemWriter();
    }

    @Bean
    public ReservaItemReader reservaItemReader(ReservaRepository reservaRepository) {
        return new ReservaItemReader(reservaRepository);
    }

    @Bean
    public ReservaItemWriter reservaItemWriter(ReservaRepository reservaRepository) {
        return new ReservaItemWriter(reservaRepository);
    }

    @Bean
    public Step borrarReservasAntiguasStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            ReservaItemReader reservaItemReader,
            ReservaItemWriter reservaItemWriter
    ) {
        return new StepBuilder("borrarReservasAntiguasStep", jobRepository)
                .<Reserva, Reserva>chunk(100, transactionManager)
                .reader(reservaItemReader)
                .writer(reservaItemWriter)
                .build();
    }

    @Bean
    public Step borrarPersonasAntiguasStep(
            JobRepository jobRepository,
            PlatformTransactionManager transactionManager,
            ItemReader<Persona> personaItemReader,
            ItemWriter<Persona> personaItemWriter
    ) {
        return new StepBuilder("borrarPersonasAntiguasStep", jobRepository)
                .<Persona, Persona>chunk(100, transactionManager)
                .reader(personaItemReader)
                .writer(personaItemWriter)
                .build();
    }

    @Bean
    public Job limpiarAntiguosJob(
            JobRepository jobRepository,
            Step borrarReservasAntiguasStep,
            Step borrarPersonasAntiguasStep
    ) {
        return new JobBuilder("limpiarAntiguosJob", jobRepository)
                .start(borrarReservasAntiguasStep)
                .next(borrarPersonasAntiguasStep)
                .build();
    }
}