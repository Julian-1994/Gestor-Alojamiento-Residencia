package com.Gestor_Alojamiento.Config;

import com.Gestor_Alojamiento.Batch.ReservaAntiguaReader;
import com.Gestor_Alojamiento.Batch.ReservaAntiguaWriter;
import com.Gestor_Alojamiento.Model.Reserva;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.JobFactory;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableBatchProcessing
public class BatchConfig {

    @Bean
    public Job eliminarReservasAntiguasJob(JobFactory jobBuilderFactory, Step eliminarReservasAntiguasStep) {
        return jobBuilderFactory.get("eliminarReservasAntiguasJob")
                .incrementer(new RunIdIncrementer())
                .flow(eliminarReservasAntiguasStep)
                .end()
                .build();
    }

    @Bean
    public Step eliminarReservasAntiguasStep(StepBuilder stepBuilderFactory,
                                             ReservaAntiguaReader reader,
                                             ReservaAntiguaWriter writer) {
        return stepBuilderFactory.get("eliminarReservasAntiguasStep")
                .<Reserva, Reserva>chunk(10)
                .reader(reader)
                .writer(writer)
                .build();
    }
}