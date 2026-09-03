package com.primeform.primeformbackend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import entity.MachineCheck;
import repository.MachineCheckRepository;

@SpringBootApplication
@ComponentScan(basePackages = {
    "com.primeform.primeformbackend",
    "controller",
    "entity",
    "repository"
})
@EnableJpaRepositories(basePackages = "repository")
public class PrimeformbackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PrimeformbackendApplication.class, args);
    }

    @Bean
    CommandLineRunner loadData(MachineCheckRepository repository) {
        return args -> {

            if (repository.count() == 0) {

                repository.save(new MachineCheck(
                    "Power / Control Available", false));

                repository.save(new MachineCheck(
                    "E-Stop Released", false));

                repository.save(new MachineCheck(
                    "Guard / Door Closed", false));

                repository.save(new MachineCheck(
                    "No Active Alarm", false));

                repository.save(new MachineCheck(
                    "Lubrication / Coolant Ready", false));

                repository.save(new MachineCheck(
                    "Reference Return Complete", false));
            }
        };
    }
}