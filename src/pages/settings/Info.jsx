import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Box,
  Typography,
  TextField,
  Paper,
  Grid,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import {
  Edit2,
  CloseCircle,
  TickCircle,
  Buildings2,
  Location,
  Sms,
  Call,
} from "iconsax-react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

import { API_URL } from "../../config";

function Info() {
  const [update, setUpdate] = useState({
    edit: false,
  });

  const [info, setInfo] = useState({});

  const getInfo = async () => {
    try {
      const res = await fetch(`${API_URL}?getInfo=true`);
      const data = await res.json();
      setInfo(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateInfo = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const text = await response.text();
      try {
        const res = JSON.parse(text);
        if (res.status) {
          Toastify({
            text: "Updated Successfully!",
            backgroundColor: "#10b981",
          }).showToast();
          setUpdate({ ...update, edit: false });
          getInfo();
        } else {
          Toastify({
            text: res.message,
            backgroundColor: "#ef4444",
          }).showToast();
        }
      } catch (e) {
        console.error(text);
        Toastify({
          text: "Server Error",
          backgroundColor: "#ef4444",
        }).showToast();
      }
    } catch (error) {
      Toastify({
        text: "Connection Error",
        backgroundColor: "#ef4444",
      }).showToast();
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const DetailItem = ({ icon, label, value }) => (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 2 }}>
      <Box
        sx={{
          p: 1,
          borderRadius: 1,
          bgcolor: "#eff6ff",
          color: "#6366f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {value || "Not set"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Grid container spacing={4}>
      {/* Info Card */}
      <Grid item xs={12} md={7}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 1,
            border: "1px solid #e2e8f0",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              School Information
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Edit2 size={16} variant="Bold" />}
              onClick={() => setUpdate({ ...update, edit: true })}
              size="small"
            >
              Edit Details
            </Button>
          </Box>

          <Stack divider={<Divider flexItem sx={{ my: 2 }} />}>
            <DetailItem
              icon={<Buildings2 size={20} />}
              label="School Name"
              value={info.name}
            />
            <DetailItem
              icon={<Location size={20} />}
              label="Address"
              value={info.address}
            />
            <DetailItem
              icon={<Sms size={20} />}
              label="Email"
              value={info.email}
            />
            <DetailItem
              icon={<Call size={20} />}
              label="Phone"
              value={info.phone}
            />
          </Stack>

          <Box sx={{ mt: 3, p: 3, bgcolor: "#f8fafc", borderRadius: 1 }}>
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ mb: 0.5, color: "#6366f1" }}
                >
                  Motto
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontStyle: "italic", fontFamily: "serif" }}
                >
                  "{info.motto}"
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ mb: 0.5 }}
                >
                  Vision
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {info.vision}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ mb: 0.5 }}
                >
                  Mission
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {info.mission}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Grid>

      {/* Logo Card */}
      <Grid item xs={12} md={5}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 1,
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3 }}>
            School Logo
          </Typography>
          <Box
            sx={{
              width: 200,
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#f8fafc",
              borderRadius: "50%",
              mb: 3,
              border: "4px solid #e2e8f0",
            }}
          >
            <img src="images/coat.png" width="150" alt="School Coat of Arms" />
          </Box>
          <Button
            variant="contained"
            component="label"
            sx={{ borderRadius: 2 }}
          >
            Upload New Logo
            <input hidden accept="image/*" multiple type="file" />
          </Button>
        </Paper>
      </Grid>

      {/* Edit Dialog */}
      <Dialog
        open={update.edit}
        onClose={() => setUpdate({ ...update, edit: false })}
        PaperProps={{ sx: { borderRadius: 1, width: 500 } }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Update School Info
          </Typography>
          <IconButton
            size="small"
            onClick={() => setUpdate({ ...update, edit: false })}
          >
            <CloseCircle size={20} />
          </IconButton>
        </Box>

        <form onSubmit={updateInfo} style={{ padding: 24 }}>
          <Stack spacing={2}>
            <TextField
              label="School Name"
              name="school_name"
              defaultValue={info.name}
              fullWidth
              size="small"
            />
            <TextField
              label="Address"
              name="address"
              defaultValue={info.address}
              fullWidth
              size="small"
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Email"
                name="email"
                defaultValue={info.email}
                fullWidth
                size="small"
              />
              <TextField
                label="Phone"
                name="phone"
                defaultValue={info.phone}
                fullWidth
                size="small"
              />
            </Stack>

            <TextField
              label="Motto"
              name="motto"
              defaultValue={info.motto}
              fullWidth
              size="small"
            />
            <TextField
              label="Vision"
              name="vision"
              defaultValue={info.vision}
              fullWidth
              multiline
              rows={2}
              size="small"
            />
            <TextField
              label="Mission"
              name="mission"
              defaultValue={info.mission}
              fullWidth
              multiline
              rows={2}
              size="small"
            />
          </Stack>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              borderRadius: 2,
              py: 1.5,
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            }}
          >
            Save Changes
          </Button>
        </form>
      </Dialog>
    </Grid>
  );
}

export default Info;
