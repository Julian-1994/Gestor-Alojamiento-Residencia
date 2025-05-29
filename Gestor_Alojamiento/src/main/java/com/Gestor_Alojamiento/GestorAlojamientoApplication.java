package com.Gestor_Alojamiento;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.Gestor_Alojamiento")
public class GestorAlojamientoApplication implements CommandLineRunner {

	 @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job limpiarAntiguosJob;

	public static void main(String[] args) {
		SpringApplication.run(GestorAlojamientoApplication.class, args);
	}

	@Override
    public void run(String... args) throws Exception {
        JobParameters params = new JobParametersBuilder()
            .addLong("time", System.currentTimeMillis())
            .toJobParameters();
        jobLauncher.run(limpiarAntiguosJob, params);
    }

}
