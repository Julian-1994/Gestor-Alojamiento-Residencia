package com.Gestor_Alojamiento.Batch;

import com.Gestor_Alojamiento.Model.Persona;
import com.Gestor_Alojamiento.Repositorios.PersonaRepository;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;

import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EstadisticasTasklet implements Tasklet {

    @Autowired
    private PersonaRepository personaRepository;
  
    @Autowired
    private JavaMailSender mailSender;
    @Value("${estadisticas.destinatarios}")
    private String[] destinatarios;

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        StringBuilder estadisticas = new StringBuilder();
        estadisticas.append("Estadísticas diarias:\n\n");

        // Calcular la media de edad de las personas
    List<Persona> personas = personaRepository.findAll();
    if (personas.isEmpty()) {
        estadisticas.append("No hay personas registradas.\n");
    } else {
        double sumaEdades = 0;
        int total = 0;
        java.time.LocalDate hoy = java.time.LocalDate.now();

        for (com.Gestor_Alojamiento.Model.Persona persona : personas) {
            if (persona.getFechaNacimiento() != null) {
                java.time.LocalDate nacimiento = persona.getFechaNacimiento().toInstant()
                        .atZone(java.time.ZoneId.systemDefault()).toLocalDate();
                int edad = java.time.Period.between(nacimiento, hoy).getYears();
                sumaEdades += edad;
                total++;
            }
        }
        double mediaEdad = total > 0 ? sumaEdades / total : 0;
        estadisticas.append("Media de edad de las personas: ")
                    .append(String.format("%.2f", mediaEdad))
                    .append(" años\n");
    }
    
        // Se pueden añadir más estadísticas aquí...

        // Enviar correo
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatarios);
        message.setSubject("Estadísticas diarias de la residencia");
        message.setText(estadisticas.toString());
        mailSender.send(message);

        return RepeatStatus.FINISHED;
    }
}