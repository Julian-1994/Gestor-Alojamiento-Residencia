package com.Gestor_Alojamiento.Batch;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class EstadisticasScheduler {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job estadisticasJob;


    @Scheduled(cron = "0 0 8 * * *")
    public void lanzarJob() {
        try {
            JobParameters params = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis()) // Parámetro único
                .toJobParameters();
            jobLauncher.run(estadisticasJob, params);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}