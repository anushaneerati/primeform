
package repository;

import org.springframework.data.jpa.repository.JpaRepository;

import entity.MachineCheck;

public interface MachineCheckRepository extends JpaRepository<MachineCheck, Long> {

}