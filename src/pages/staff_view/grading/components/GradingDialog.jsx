import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Paper,
  IconButton,
  InputAdornment,
  Chip,
  LinearProgress,
  Stack,
  TableContainer,
  Button,
  Slide,
  InputBase,
} from "@mui/material";
import {
  CloseCircle,
  Buildings,
  Eye,
  SearchNormal,
  Trash,
} from "iconsax-react";

const GradingDialog = ({
  open,
  onClose,
  acaData,
  progress,
  info,
  rows,
  studentLoading,
  isMobile,
  schoolType,
  onDeleteMarkRow,
  onUpdateMark,
  onLocalUpdate,
}) => {
  const [search, setSearch] = useState("");

  const filteredRows = rows.filter((row) => {
    const fullName = `${row.last} ${row.first}`.toLowerCase();
    const reg = (row.student_reg || "").toLowerCase();
    const term = search.toLowerCase();
    return fullName.includes(term) || reg.includes(term);
  });

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
    >
      <Box
        sx={{
          bgcolor: "#f8fafc",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Toolbar */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#fff",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            zIndex: 1100,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", md: "center" }}
            sx={{ flexGrow: 1 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "12px",
                  bgcolor: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                  display: { xs: "none", sm: "flex" },
                }}
              >
                <Buildings size={24} variant="Bulk" color="#0b6bf1" />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ color: "#0f172a", lineHeight: 1.2 }}
                >
                  {acaData.name} — Term {acaData.term}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  Form {acaData.form} <span style={{ opacity: 0.3 }}>•</span>{" "}
                  Class Student List
                </Typography>
              </Box>
            </Box>

            {/* Search Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.8,
                borderRadius: "12px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                width: "100%",
                maxWidth: 400,
                transition: "all 0.2s",
                "&:focus-within": {
                  borderColor: "#6366f1",
                  bgcolor: "#fff",
                  boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.1)",
                },
              }}
            >
              <SearchNormal size={20} color="#94a3b8" />
              <InputBase
                fullWidth
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ fontSize: 14, fontWeight: 600 }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={3} alignItems="center">
            {!isMobile && (
              <Box sx={{ minWidth: 200 }}>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="textSecondary"
                  >
                    Grading Progress
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="primary"
                  >
                    {progress}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "#f1f5f9",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      bgcolor: "#6366f1",
                    },
                  }}
                />
              </Box>
            )}

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={info.status === "active" ? "Storage Open" : "Read Only"}
                size="small"
                sx={{
                  fontWeight: 800,
                  bgcolor: info.status === "active" ? "#dcfce7" : "#f1f5f9",
                  color: info.status === "active" ? "#15803d" : "#64748b",
                  px: 0.5,
                }}
              />
              <IconButton
                onClick={onClose}
                sx={{
                  bgcolor: "#f1f5f9",
                  "&:hover": { bgcolor: "#fee2e2", color: "#ef4444" },
                  transition: "all 0.2s",
                }}
              >
                <CloseCircle size={24} color="#ff0800" />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>

        {/* Content Area */}
        <Box
          sx={{
            p: { xs: 1.5, md: 4 },
            flexGrow: 1,
            overflowX: "hidden",
            maxWidth: "1400px",
            width: "100%",
            mx: "auto",
          }}
        >
          {info.status === "active" ? (
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1px solid rgba(0,0,0,0.05)",
                overflow: "hidden",
                bgcolor: "#fff",
                boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
              }}
            >
              <TableContainer
                sx={{ maxHeight: "calc(100vh - 160px)", overflowX: "auto" }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          bgcolor: "#f8fafc",
                          fontWeight: 800,
                          color: "#475569",
                          width: 60,
                        }}
                      >
                        #
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "#f8fafc",
                          fontWeight: 800,
                          color: "#475569",
                          width: { xs: 120, sm: 180, md: "auto" }, // reduce on mobile
                        }}
                      >
                        Student Full Names
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "#f8fafc",
                          fontWeight: 800,
                          color: "#475569",
                          width: { xs: 120, md: 180 },
                          textAlign: "center",
                        }}
                      >
                        Exam{" "}
                        <Typography
                          variant="caption"
                          sx={{ display: "block", opacity: 0.6 }}
                        >
                          (100%)
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "#f8fafc",
                          fontWeight: 800,
                          color: "#475569",
                          width: 80,
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {studentLoading ? (
                      Array.from({ length: 8 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={4} sx={{ py: 3 }}>
                            <LinearProgress
                              sx={{ opacity: 0.1, borderRadius: 2 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                          <Box sx={{ opacity: 0.4 }}>
                            <Eye
                              size={60}
                              variant="Broken"
                              style={{ marginBottom: 16 }}
                            />
                            <Typography fontWeight={700}>
                              No Student Data
                            </Typography>
                            <Typography variant="body2">
                              {search
                                ? `No results found for "${search}"`
                                : "No students have been enrolled in this class yet."}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRows.map((row, index) => (
                        <TableRow
                          key={row.id}
                          hover
                          sx={{
                            bgcolor:
                              row.end_term !== ""
                                ? "rgba(82, 98, 240, 0.2)"
                                : "inherit",
                            "&:hover": { bgcolor: "#f8fafc" },
                          }}
                        >
                          <TableCell sx={{ color: "#94a3b8", fontWeight: 600 }}>
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="label"
                              sx={{ color: "#1e293b" }}
                            >
                              {row.last.toUpperCase() +
                                " " +
                                row.first.toUpperCase() || "Unknown Student"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <TextField
                              size="small"
                              type="number"
                              variant="outlined"
                              value={row.end_term || ""}
                              onChange={(e) =>
                                onLocalUpdate(
                                  row.id,
                                  "end_term",
                                  e.target.value,
                                )
                              }
                              onBlur={(e) =>
                                onUpdateMark(
                                  row.id,
                                  acaData.subject_id,
                                  acaData.form,
                                  acaData.academic_id,
                                  e.target.value,
                                )
                              }
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    sx={{
                                      "& .MuiTypography-root": {
                                        fontSize: 12,
                                        fontWeight: 700,
                                        opacity: 0.5,
                                      },
                                    }}
                                  >
                                    %
                                  </InputAdornment>
                                ),
                                sx: {
                                  borderRadius: "10px",
                                  fontWeight: 800,
                                  color: "#059669",
                                  "& input": { textAlign: "center" },
                                  bgcolor: "#fcfdff",
                                },
                              }}
                              sx={{
                                maxWidth: 100,
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderColor: "rgba(16, 185, 129, 0.1)",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#10b981",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#10b981",
                                  },
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton
                              size="small"
                              color="error"
                              sx={{
                                opacity: row.end_term ? 0.8 : 0.2,
                                "&:hover": { opacity: 1, bgcolor: "#fee2e2" },
                                transition: "all 0.2s",
                              }}
                              onClick={() =>
                                onDeleteMarkRow(
                                  row.id,
                                  acaData.subject_id,
                                  acaData.form,
                                  acaData.academic_id,
                                )
                              }
                              disabled={!row.end_term}
                            >
                              <Trash
                                size={18}
                                variant="Broken"
                                color="#ff0000"
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 12,
                borderRadius: "24px",
                bgcolor: "rgba(239, 68, 68, 0.03)",
                border: "2px dashed rgba(239, 68, 68, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={900}
                color="error"
                gutterBottom
                sx={{ opacity: 0.8 }}
              >
                Grading Period Locked
              </Typography>
              <Typography
                sx={{ color: "#64748b", mb: 4, maxWidth: 500, mx: "auto" }}
              >
                The administration has closed the mark entry window for this
                session. You can view the list, but updates are currently
                disabled.
              </Typography>
              <Button
                variant="outlined"
                color="inherit"
                onClick={onClose}
                sx={{ borderRadius: "12px", textTransform: "none", px: 4 }}
              >
                Return to My Classes
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default GradingDialog;
