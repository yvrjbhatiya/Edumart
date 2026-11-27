import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersAsync,
  resetOrderUpdateStatus,
  selectOrderUpdateStatus,
  selectOrders,
  updateOrderByIdAsync,
} from "../../order/OrderSlice";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Avatar,
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { noOrdersAnimation } from "../../../assets/index";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

const STATUS_STYLES = {
  Pending: { bg: "#F3E8FF", fg: "#7E22CE", dot: "#A855F7" },
  Dispatched: { bg: "#FEF9C3", fg: "#A16207", dot: "#EAB308" },
  "Out for delivery": { bg: "#DBEAFE", fg: "#1D4ED8", dot: "#3B82F6" },
  Delivered: { bg: "#DCFCE7", fg: "#15803D", dot: "#22C55E" },
  Cancelled: { bg: "#FEE2E2", fg: "#B91C1C", dot: "#EF4444" },
};

const headCellSx = {
  fontWeight: 700,
  fontSize: "0.72rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "text.secondary",
  backgroundColor: "#F8FAFF",
  borderBottom: "1px solid",
  borderColor: "divider",
  whiteSpace: "nowrap",
};

export const AdminOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const [editIndex, setEditIndex] = useState(-1);
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus);
  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(getAllOrdersAsync());
  }, [dispatch]);

  useEffect(() => {
    if (orderUpdateStatus === "fulfilled") {
      toast.success("Status updated");
    } else if (orderUpdateStatus === "rejected") {
      toast.error("Error updating order status");
    }
  }, [orderUpdateStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetOrderUpdateStatus());
    };
  }, []);

  const handleUpdateOrder = (data) => {
    const update = { ...data, _id: orders[editIndex]._id };
    setEditIndex(-1);
    dispatch(updateOrderByIdAsync(update));
  };

  const editOptions = [
    "Pending",
    "Dispatched",
    "Out for delivery",
    "Delivered",
    "Cancelled",
  ];

  // quick summary numbers for the stats strip
  const statusCounts = editOptions.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));

  const renderStatusChip = (status) => {
    const st = STATUS_STYLES[status] || { bg: "#F1F5F9", fg: "#475569", dot: "#94A3B8" };
    return (
      <Chip
        label={status}
        icon={
          <Box
            component="span"
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: `${st.dot} !important`,
              ml: "10px !important",
            }}
          />
        }
        sx={{
          height: 28,
          fontWeight: 700,
          fontSize: "0.75rem",
          backgroundColor: st.bg,
          color: st.fg,
        }}
      />
    );
  };

  return (
    <Stack
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 1.5, sm: 3 },
        pb: 6,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={{ xs: 1, sm: 2 }}
        mt={{ xs: 2, sm: 4 }}
        mb={3}
      >
        <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.92 }}>
          <IconButton
            component={Link}
            to={"/admin/dashboard"}
            aria-label="Back to dashboard"
            sx={{
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
              "&:hover": { backgroundColor: "#EEF2FF", color: "primary.main" },
            }}
          >
            <ArrowBackIcon fontSize={is480 ? "small" : "medium"} />
          </IconButton>
        </motion.div>

        <Stack>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              width: "fit-content",
            }}
          >
            Manage Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {orders.length} {orders.length === 1 ? "order" : "orders"} in total
          </Typography>
        </Stack>
      </Stack>

      {/* Stats strip */}
      {orders.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gap: { xs: 1, sm: 1.5 },
            mb: 3,
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(5, 1fr)",
            },
          }}
        >
          {statusCounts.map(({ status, count }, i) => {
            const st = STATUS_STYLES[status];
            return (
              <Box
                key={status}
                component={motion.div}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: "16px",
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 8px 24px rgba(15,23,42,.05)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    backgroundColor: st.dot,
                  },
                }}
              >
                <Typography variant="body2" color="text.secondary" noWrap>
                  {status}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: st.fg }}>
                  {count}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      <Stack
        component={"form"}
        noValidate
        onSubmit={handleSubmit(handleUpdateOrder)}
      >
        {orders.length ? (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              width: "100%",
              overflowX: "auto",
              borderRadius: "20px",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 12px 32px rgba(15,23,42,.06)",
            }}
          >
            <Table aria-label="orders table" sx={{ minWidth: 980 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={headCellSx}>Order</TableCell>
                  <TableCell sx={headCellSx} align="left">Id</TableCell>
                  <TableCell sx={headCellSx} align="left">Item</TableCell>
                  <TableCell sx={headCellSx} align="right">Total Amount</TableCell>
                  <TableCell sx={headCellSx} align="left">Shipping Address</TableCell>
                  <TableCell sx={headCellSx} align="left">Payment Method</TableCell>
                  <TableCell sx={headCellSx} align="left">Order Date</TableCell>
                  <TableCell sx={headCellSx} align="left">Status</TableCell>
                  <TableCell sx={headCellSx} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order, index) => (
                  <TableRow
                    key={order._id}
                    hover
                    sx={{
                      transition: "background-color .2s ease",
                      backgroundColor: editIndex === index ? "#F5F7FF" : "inherit",
                      "&:hover": { backgroundColor: "#F8FAFF" },
                      "&:last-child td, &:last-child th": { border: 0 },
                      "& td": { borderColor: "divider", verticalAlign: "top", py: 2 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          color: "primary.main",
                          backgroundColor: "#EEF2FF",
                        }}
                      >
                        {index + 1}
                      </Box>
                    </TableCell>

                    <TableCell align="left">
                      <Tooltip title={order._id}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                            color: "text.secondary",
                          }}
                        >
                          #{String(order._id).slice(-8)}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    <TableCell align="left">
                      <Stack spacing={1.25}>
                        {order.item.map((product) => (
                          <Stack
                            key={product.product._id}
                            flexDirection={"row"}
                            alignItems={"center"}
                            columnGap={1.5}
                          >
                            <Avatar
                              variant="rounded"
                              src={product.product.thumbnail}
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "12px",
                                backgroundColor: "#EEF2FF",
                                "& img": { objectFit: "contain", p: 0.5 },
                              }}
                            />
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              sx={{ maxWidth: 220 }}
                              noWrap
                            >
                              {product.product.title}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <Typography fontWeight={800}>₹{order.total}</Typography>
                    </TableCell>

                    <TableCell align="left">
                      <Stack>
                        <Typography variant="body2" fontWeight={600}>
                          {order.address?.[0]?.street}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.address?.[0]?.city}, {order.address?.[0]?.state}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.address?.[0]?.postalCode}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell align="left">
                      <Chip
                        label={order.paymentMode}
                        variant="outlined"
                        sx={{ borderColor: "#C7D2FE", color: "primary.main", fontWeight: 600 }}
                      />
                    </TableCell>

                    <TableCell align="left" sx={{ whiteSpace: "nowrap" }}>
                      {new Date(order.createdAt).toDateString()}
                    </TableCell>

                    <TableCell align="left" sx={{ minWidth: 180 }}>
                      {editIndex === index ? (
                        <FormControl fullWidth size="small">
                          <InputLabel id="demo-simple-select-label">
                            Update status
                          </InputLabel>
                          <Select
                            defaultValue={order.status}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Update status"
                            {...register("status", {
                              required: "Status is required",
                            })}
                          >
                            {editOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        renderStatusChip(order.status)
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {editIndex === index ? (
                        <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                          <Tooltip title="Save">
                            <IconButton
                              type="submit"
                              aria-label="Save status"
                              sx={{
                                color: "#fff",
                                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                                "&:hover": { opacity: 0.9 },
                              }}
                            >
                              <CheckCircleOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      ) : (
                        <Tooltip title="Edit status">
                          <IconButton
                            onClick={() => setEditIndex(index)}
                            aria-label="Edit status"
                            sx={{
                              backgroundColor: "rgba(79,70,229,0.06)",
                              "&:hover": {
                                backgroundColor: "rgba(79,70,229,0.15)",
                                color: "primary.main",
                              },
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Stack
            alignSelf="center"
            width={is480 ? "100%" : "30rem"}
            justifyContent={"center"}
            sx={{
              p: 3,
              borderRadius: "24px",
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack rowGap={"1rem"}>
              <Lottie animationData={noOrdersAnimation} />
              <Typography
                textAlign={"center"}
                alignSelf={"center"}
                variant="h6"
                fontWeight={500}
                color="text.secondary"
              >
                There are no orders currently
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default AdminOrders;