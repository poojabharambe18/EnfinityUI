import { useState, useContext, useEffect } from "react";
import { useStyles } from "./style";
import quickview from "assets/images/Quick_view.png";
import IconButton from "@mui/material/IconButton";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import {
  Button,
  Box,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Popover,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useQuery } from "react-query";
import * as API from "./api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { Alert, queryClient } from "@acuteinfo/common-base";

export const Quick_View = () => {
  const authController = useContext(AuthContext);
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["GETQUICKACCESSVIEW"], () =>
    API.getQuickView({
      userID: authController?.authState?.user?.id,
      branchCode: authController?.authState?.user?.branchCode,
      companyID: authController?.authState?.companyID,
    })
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["GETQUICKACCESSVIEW"]);
    };
  }, []);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClickd = (event) => {
    refetch();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Tooltip title="Quick-View" placement="bottom" arrow>
        <IconButton
          // color="inherit"
          onClick={handleClickd}
          sx={{
            backgroundColor: anchorEl
              ? "var(--theme-color3)"
              : "rgba(235, 237, 238, 0.45)",
            borderRadius: "10px",
            height: "30px",
            width: "30px",
            "&:hover": {
              background: "var(--theme-color2)",
              borderRadius: "10px",
              transition: "all 0.2s ease 0s",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              "& .MuiSvgIcon-root": {
                height: "32px",
                width: "32px",
                transition: "all 0.2s ease 0s",
                padding: "4px",
              },
            },
          }}
        >
          <SensorsOutlinedIcon
            fontSize="small"
            sx={{
              color: anchorEl ? "var(--theme-color2)" : "var(--theme-color3)",
            }}
          />
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        elevation={8}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            maxWidth: "495px",
            width: "495px",
          },
        }}

        // classes={{ paper: classes.popover }}
      >
        <Box m={2}>
          <Grid container>
            <Grid item xs={5}>
              <img
                onClick={() => refetch()}
                src={quickview}
                style={{
                  background: "#ECEFF9",
                  borderRadius: "12.7947px",
                  height: "200px",
                  cursor: "pointer",
                }}
                alt=""
              />
            </Grid>
            <Grid
              item
              xs={7}
              sx={{
                pl: "25px",
                height: "200px",
                "& .MuiListItemButton-root": {
                  pl: "0px",
                },
              }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ py: 1, display: "list-item" }}
                  onClick={() => {
                    navigate("/EnfinityCore/change-branch");
                  }}
                >
                  Switch Branch
                </ListItemButton>
              </ListItem>
              {isError ? (
                <div style={{ width: "100%", paddingTop: "10px" }}>
                  <Alert
                    severity={error?.severity ?? "error"}
                    errorMsg={error?.error_msg ?? "Error"}
                    errorDetail={error?.error_detail ?? ""}
                  />
                </div>
              ) : isLoading || isFetching ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress color="secondary" size={15} />
                </div>
              ) : (
                <>
                  {data?.map((item) => (
                    <ListItem key={item} disablePadding sx={{ width: "auto" }}>
                      <ListItemButton
                        sx={{ display: "list-item" }}
                        onClick={(e) => {
                          if (Boolean(item.DOCUMENT_URL)) {
                            navigate(item.DOCUMENT_URL);
                            handleClose();
                          }
                        }}
                      >
                        {item?.DOC_NM}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  );
};
