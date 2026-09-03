package controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import entity.MachineCheck;
import repository.MachineCheckRepository;


@RestController
@RequestMapping("/api/machine-checks")
@CrossOrigin(origins = "http://localhost:5173")
public class MachineCheckController {

    private final MachineCheckRepository repository;

    public MachineCheckController(MachineCheckRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<MachineCheck> getAllChecks() {
        return repository.findAll();
    }

    @PostMapping
    public MachineCheck createCheck(@RequestBody MachineCheck machineCheck) {
        return repository.save(machineCheck);
    }

    @PutMapping("/{id}")
    public MachineCheck updateCheck(
            @PathVariable Long id,
            @RequestBody MachineCheck machineCheck) {

        MachineCheck existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine check not found"));

        existing.setName(machineCheck.getName());
        existing.setConfirmed(machineCheck.isConfirmed());

        return repository.save(existing);
    }
}