import { useState, useEffect } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
  const [stage, setStage] = useState(1);
  const [operationStatus, setOperationStatus] = useState("READY");
  const [workpieceConfirmed, setWorkpieceConfirmed] =
    useState(false);

  // =====================================================
  // STAGE 1 - MACHINE CHECKS
  // =====================================================

  const [checks, setChecks] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/machine-checks`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch machine checks");
        }

        return response.json();
      })
      .then((data) => {
        setChecks(data);
      })
      .catch((error) => {
        console.error(
          "Error fetching machine checks:",
          error
        );
      });
  }, []);

  // Confirm Machine Check
  const confirmCheck = (id) => {
    fetch(`${API_URL}/api/machine-checks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        confirmed: true,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to update machine check"
          );
        }

        return response.json();
      })
      .then((updatedCheck) => {
        setChecks((currentChecks) =>
          currentChecks.map((check) =>
            check.id === id ? updatedCheck : check
          )
        );
      })
      .catch((error) => {
        console.error(
          "Error confirming machine check:",
          error
        );
      });
  };

  // =====================================================
  // STAGE 2 - REQUIRED TOOLS
  // =====================================================

  const [tools, setTools] = useState([
    {
      id: 1,
      number: "T01",
      type: "Face Mill Ø50mm",
      confirmed: false,
    },
    {
      id: 2,
      number: "T05",
      type: "Ø10mm End Mill",
      confirmed: false,
    },
    {
      id: 3,
      number: "T08",
      type: "Ø6mm Drill",
      confirmed: false,
    },
  ]);

  const confirmTool = (id) => {
    setTools((currentTools) =>
      currentTools.map((tool) =>
        tool.id === id
          ? { ...tool, confirmed: true }
          : tool
      )
    );
  };

  // =====================================================
  // PROGRESS
  // =====================================================

  const completedChecks = checks.filter(
    (check) => check.confirmed
  ).length;

  const completedTools = tools.filter(
    (tool) => tool.confirmed
  ).length;

  const allChecksCompleted =
    checks.length > 0 &&
    completedChecks === checks.length;

  const allToolsCompleted =
    completedTools === tools.length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="app">

      {/* HEADER */}
      <header>
        <h1>VMC OPERATOR HMI</h1>
        <p>Startup Guidance</p>
      </header>

      <main>

        {/* =================================================
            STAGE 1 - MACHINE CHECKS
        ================================================= */}

        {stage === 1 && (
          <>
            <div className="stage-header">
              <span>STAGE 1 OF 5</span>

              <span>
                {completedChecks} / {checks.length} COMPLETED
              </span>
            </div>

            <h2>Machine Checks</h2>

            <p className="instruction">
              Confirm each machine check before proceeding.
            </p>

            <div className="checks">

              {checks.length === 0 ? (
                <div className="check-item">
                  <p>Loading machine checks...</p>
                </div>
              ) : (
                checks.map((check) => (
                  <div
                    key={check.id}
                    className={`check-item ${
                      check.confirmed
                        ? "confirmed"
                        : ""
                    }`}
                  >

                    <div>
                      <span className="check-number">
                        {check.id}
                      </span>

                      <span className="check-name">
                        {check.name}
                      </span>
                    </div>

                    {check.confirmed ? (
                      <span className="status">
                        ✓ CONFIRMED
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          confirmCheck(check.id)
                        }
                      >
                        CONFIRM CHECK
                      </button>
                    )}

                  </div>
                ))
              )}

            </div>

            {/* Progress */}

            <div className="progress-section">

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width:
                      checks.length > 0
                        ? `${
                            (completedChecks /
                              checks.length) *
                            100
                          }%`
                        : "0%",
                  }}
                ></div>

              </div>

              <p>
                Progress: {completedChecks} /{" "}
                {checks.length}
              </p>

            </div>

            {/* Next */}

            <button
              className="next-button"
              disabled={!allChecksCompleted}
              onClick={() => setStage(2)}
            >
              NEXT
            </button>
          </>
        )}

        {/* =================================================
            STAGE 2 - REQUIRED TOOLS
        ================================================= */}

        {stage === 2 && (
          <>
            <div className="stage-header">
              <span>STAGE 2 OF 5</span>

              <span>
                {completedTools} / {tools.length} COMPLETED
              </span>
            </div>

            <h2>Required Tools</h2>

            <p className="instruction">
              Insert and confirm each required tool.
            </p>

            <div className="program-info">

              <div>
                <strong>CNC Program</strong>
                <span>VMC-001</span>
              </div>

              <div>
                <strong>Revision</strong>
                <span>REV-B</span>
              </div>

            </div>

            <div className="checks">

              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className={`check-item ${
                    tool.confirmed
                      ? "confirmed"
                      : ""
                  }`}
                >

                  <div>
                    <span className="check-number">
                      {tool.id}
                    </span>

                    <div>
                      <div className="check-name">
                        {tool.number}
                      </div>

                      <div className="tool-type">
                        {tool.type}
                      </div>
                    </div>
                  </div>

                  {tool.confirmed ? (
                    <span className="status">
                      ✓ CONFIRMED
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        confirmTool(tool.id)
                      }
                    >
                      CONFIRM TOOL
                    </button>
                  )}

                </div>
              ))}

            </div>

            <div className="progress-section">

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      (completedTools /
                        tools.length) *
                      100
                    }%`,
                  }}
                ></div>

              </div>

              <p>
                Progress: {completedTools} /{" "}
                {tools.length}
              </p>

            </div>

            <button
              className="next-button"
              disabled={!allToolsCompleted}
              onClick={() => setStage(3)}
            >
              NEXT
            </button>
          </>
        )}

        {/* =================================================
            STAGE 3 - WORKPIECE SETUP
        ================================================= */}

        {stage === 3 && (
          <>
            <div className="stage-header">
              <span>STAGE 3 OF 5</span>

              <span>
                {workpieceConfirmed
                  ? "1 / 1 COMPLETED"
                  : "0 / 1 COMPLETED"}
              </span>
            </div>

            <h2>Workpiece Setup</h2>

            <p className="instruction">
              Arrange, clamp and confirm the workpiece setup.
            </p>

            <div className="workpiece-card">

              <div className="workpiece-row">
                <span>Material</span>
                <strong>Aluminium 6061</strong>
              </div>

              <div className="workpiece-row">
                <span>Drawing Revision</span>
                <strong>REV-B</strong>
              </div>

              <div className="workpiece-row">
                <span>Fixture</span>
                <strong>4-Jaw Fixture</strong>
              </div>

              <div className="workpiece-row">
                <span>Orientation</span>
                <strong>
                  Machined face upward
                </strong>
              </div>

              <div className="workpiece-row">
                <span>Clamping Instruction</span>
                <strong>
                  Securely clamp the workpiece against
                  fixture stops.
                </strong>
              </div>

              <div className="workpiece-row">
                <span>Work Offset</span>
                <strong>G54</strong>
              </div>

            </div>

            {!workpieceConfirmed ? (
              <button
                className="next-button"
                onClick={() =>
                  setWorkpieceConfirmed(true)
                }
              >
                CONFIRM SETUP
              </button>
            ) : (
              <>
                <div className="setup-confirmed">
                  ✓ WORKPIECE SETUP CONFIRMED
                </div>

                <button
                  className="next-button"
                  onClick={() => setStage(4)}
                >
                  NEXT
                </button>
              </>
            )}
          </>
        )}

        {/* =================================================
            STAGE 4 - READY REVIEW
        ================================================= */}

        {stage === 4 && (
          <>
            <div className="stage-header">
              <span>STAGE 4 OF 5</span>
              <span>READY REVIEW</span>
            </div>

            <h2>Ready Review</h2>

            <p className="instruction">
              Review all completed machine, tooling and
              workpiece checks.
            </p>

            <div className="review-card">

              <div className="review-item">
                <div>
                  <strong>Machine Checks</strong>

                  <span>
                    All 6 machine checks completed
                  </span>
                </div>

                <span className="review-status">
                  ✓ COMPLETE
                </span>
              </div>

              <div className="review-item">
                <div>
                  <strong>Required Tools</strong>

                  <span>
                    All 3 required tools confirmed
                  </span>
                </div>

                <span className="review-status">
                  ✓ COMPLETE
                </span>
              </div>

              <div className="review-item">
                <div>
                  <strong>Workpiece Setup</strong>

                  <span>
                    Fixture, orientation, clamping and
                    work offset confirmed
                  </span>
                </div>

                <span className="review-status">
                  ✓ COMPLETE
                </span>
              </div>

            </div>

            <div className="ready-box">

              <div className="ready-icon">
                ✓
              </div>

              <h3>READY</h3>

              <p>
                Machine, tooling and workpiece setup are
                complete.
              </p>

            </div>

            <button
              className="next-button"
              onClick={() => setStage(5)}
            >
              PROCEED TO OPERATION
            </button>
          </>
        )}

        {/* =================================================
            STAGE 5 - OPERATION
        ================================================= */}

        {stage === 5 && (
          <>
            <div className="stage-header">
              <span>STAGE 5 OF 5</span>
              <span>OPERATION</span>
            </div>

            <h2>Operation</h2>

            <p className="instruction">
              Start or stop the simulated VMC operation.
            </p>

            <div className="operation-card">

              <div className="operation-info">
                <span>Operation</span>
                <strong>
                  VMC Milling Operation
                </strong>
              </div>

              <div className="operation-info">
                <span>CNC Program</span>
                <strong>VMC-001</strong>
              </div>

              <div className="operation-info">
                <span>Program Revision</span>
                <strong>REV-B</strong>
              </div>

            </div>

            <div
              className={`operation-status ${
                operationStatus.toLowerCase()
              }`}
            >

              <div className="status-indicator"></div>

              <span>STATUS</span>

              <strong>
                {operationStatus}
              </strong>

            </div>

            <div className="operation-controls">

              <button
                className="start-button"
                disabled={
                  operationStatus === "RUNNING"
                }
                onClick={() =>
                  setOperationStatus("RUNNING")
                }
              >
                ▶ START OPERATION
              </button>

              <button
                className="stop-button"
                disabled={
                  operationStatus !== "RUNNING"
                }
                onClick={() =>
                  setOperationStatus("STOPPED")
                }
              >
                ■ STOP OPERATION
              </button>

            </div>

            {operationStatus === "RUNNING" && (
              <div className="running-message">
                Operation is currently running.
              </div>
            )}

            {operationStatus === "STOPPED" && (
              <div className="stopped-message">
                Operation stopped. Latest stage has
                been preserved.
              </div>
            )}

          </>
        )}

      </main>
    </div>
  );
}

export default App;