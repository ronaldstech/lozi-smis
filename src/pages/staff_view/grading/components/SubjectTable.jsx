import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Chip,
  LinearProgress,
  Stack,
  TableContainer,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { Teacher, Printer, Eye } from "iconsax-react";

const SubjectTable = ({
  sub,
  loading,
  isMobile,
  academic,
  onGradeClass,
  onPrintMarks,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: { xs: 0, md: 1 },
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0,0,0,0.05)",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(248, 250, 252, 0.7)" }}>
              <TableCell sx={{ fontWeight: 700, color: "#475569", py: 2.5 }}>
                #
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                Subject
              </TableCell>
              {!isMobile && (
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Academic Year
                </TableCell>
              )}
              {!isMobile && (
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Term
                </TableCell>
              )}
              <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                Class
              </TableCell>
              {!isMobile && (
                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                  Grading Progress
                </TableCell>
              )}
              <TableCell
                align="right"
                sx={{ fontWeight: 700, color: "#475569", pr: 4 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ p: 0 }}>
                  <LinearProgress
                    sx={{
                      bgcolor: "#e0e7ff",
                      "& .MuiLinearProgress-bar": { bgcolor: "#6366f1" },
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : sub.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 8, color: "#64748b" }}
                >
                  <Stack spacing={2} alignItems="center">
                    <Teacher
                      size={48}
                      variant="Broken"
                      color="#64748b"
                      style={{ opacity: 0.1 }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      No assigned subjects found.
                    </Typography>
                    <Typography variant="caption" sx={{ maxWidth: 300 }}>
                      If you believe this is an error, please contact the
                      administrator to verify your class allocations.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              sub.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    "&:hover": {
                      bgcolor: "rgba(99, 102, 241, 0.02) !important",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }}>
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      {!isMobile && (
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: "8px",
                            bgcolor:
                              row.subject_data?.root === "science"
                                ? "#f0fdf4"
                                : "#eff6ff",
                            color:
                              row.subject_data?.root === "science"
                                ? "#10b981"
                                : "#3b82f6",
                          }}
                        >
                          <Teacher size={18} variant="Bulk" color="#000000" />
                        </Box>
                      )}
                      <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
                        {row.subject_data?.name || "Unknown"}
                      </Typography>
                    </Stack>
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ color: "#64748b" }}>
                      {academic.name}
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell sx={{ color: "#64748b" }}>
                      Term {academic.term}
                    </TableCell>
                  )}
                  <TableCell>
                    <Chip
                      label={`F ${row.form}`}
                      size="small"
                      sx={{
                        bgcolor: "#f1f5f9",
                        color: "#475569",
                        fontWeight: 800,
                        borderRadius: "6px",
                        border: "1px solid rgba(0,0,0,0.05)",
                      }}
                    />
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ minWidth: 140, pr: 2 }}>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" fontWeight={700}>
                          {row.progress || 0}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={row.progress || 0}
                          sx={{
                            width: "100%",
                            height: 6,
                            borderRadius: 4,
                            bgcolor: "#f1f5f9",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 4,
                              bgcolor:
                                row.progress === 100 ? "#10b981" : "#6366f1",
                            },
                          }}
                        />
                      </Stack>
                    </TableCell>
                  )}

                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      justifyContent="flex-end"
                    >
                      <Button
                        size="small"
                        onClick={() =>
                          onGradeClass(
                            row.form,
                            row.aca_id,
                            academic.name,
                            academic.term,
                            row.subject,
                          )
                        }
                        sx={{
                          color: "#4f46e5",
                          fontWeight: 700,
                          textTransform: "none",
                          borderRadius: "10px",
                          px: 2,
                          py: 0.5,
                          backgroundColor: "rgba(99, 102, 241, 0.08)",
                          border: "1px solid rgba(99, 102, 241, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(99, 102, 241, 0.15)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                          },
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        Upload
                      </Button>
                      <Button
                        size="small"
                        onClick={() =>
                          onPrintMarks(
                            row.form,
                            row.aca_id,
                            academic.name,
                            academic.term,
                            row.subject,
                          )
                        }
                        sx={{
                          color: "#4f46e5",
                          fontWeight: 700,
                          textTransform: "none",
                          borderRadius: "10px",
                          px: 2,
                          py: 0.5,
                          backgroundColor: "rgba(45, 233, 8, 0.3)",
                          border: "1px solid rgba(45, 233, 8, 0.6)",
                          "&:hover": {
                            backgroundColor: "rgba(45, 233, 8, 0.6)",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                          },
                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        Print
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default SubjectTable;
