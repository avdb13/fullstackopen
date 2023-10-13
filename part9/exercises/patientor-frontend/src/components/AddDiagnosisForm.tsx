import {
  TextField,
  MenuItem,
  InputLabel,
  Select,
  Grid,
  Button,
  Typography,
  Slider,
  Chip,
} from "@mui/material";
import { Stack } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useRef } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { EntryFormValues, HealthCheckRating } from "../types";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

const DateField = ({ name }: { name: string }) => {
  const { control } = useFormContext();

  const toDate = (s: string): Dayjs => dayjs(s, "YYYY-DD-MM");
  const fromDate = (d: Dayjs): string => d.toISOString().slice(0, 10);

  return (
    <Controller
      defaultValue={dayjs().toISOString().slice(0, 10)}
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            format="YYYY-DD-MM"
            value={toDate(value)}
            onChange={(value) => onChange(fromDate(value!))}
          />
        </LocalizationProvider>
      )}
    />
  );
};

const entryOptions = [
  { value: "Hospital", label: "hospitalization" },
  { value: "HealthCheck", label: "health check" },
  { value: "OccupationalHealthcare", label: "occupational healthcare" },
];

const HospitalForm = () => {
  const { register } = useFormContext();

  return (
    <div>
      <Typography variant="h6">Discharge</Typography>
      <DateField name="discharge.date" />
      <TextField
        label="Criteria"
        fullWidth
        {...register("discharge.criteria")}
      />
    </div>
  );
};

const OccupationalHealthcareForm = () => {
  const { register } = useFormContext();

  return (
    <div>
      <TextField label="Employer" fullWidth {...register("employer")} />
      <Typography variant="h6">Sick Leave</Typography>
      <DateField name="sickLeave.startDate" />
      <DateField name="sickLeave.endDate" />
    </div>
  );
};

const HealthCheckForm = () => {
  const { control } = useFormContext();

  const handleLabel = (n: number) => {
    return HealthCheckRating[n].toString();
  };

  return (
    <div>
      <Typography variant="h6">Healthcheck rating</Typography>
      <Stack sx={{ margin: "30px" }}>
        <Controller
          name="healthCheckRating"
          control={control}
          defaultValue={0}
          render={({ field: { onChange } }) => (
            <Slider
              step={1}
              min={0}
              max={3}
              color="secondary"
              valueLabelFormat={handleLabel}
              valueLabelDisplay="on"
              onChange={onChange}
            />
          )}
        />
      </Stack>
    </div>
  );
};

const EntryForm = ({ entry }: { entry: string }): JSX.Element => {
  switch (entry) {
    case "Hospital":
      return <HospitalForm />;
    case "HealthCheck":
      return <HealthCheckForm />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareForm />;
    default:
      return <div></div>;
  }
};

interface Props {
  onCancel: () => void;
  onSubmit: (values: any) => void;
  patientId: string;
}

const AddDiagnosisForm = ({ onCancel, onSubmit, patientId }: Props) => {
  const methods = useForm<EntryFormValues>();
  const diagnosisCode = useRef<HTMLInputElement>(null);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ margin: "10px" }}
      >
        <TextField
          label="Description"
          fullWidth
          {...methods.register("description")}
        />
        <DateField name="date"  />
        <TextField
          label="Specialist"
          fullWidth
          {...methods.register("specialist")}
        />
        <Controller
          name="diagnosisCodes"
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <>
              <Grid container>
                <Grid item xs="auto">
                  <TextField
                    label="DiagnosisCode"
                    fullWidth
                    inputRef={diagnosisCode}
                  />
                </Grid>
                <Grid item alignItems="stretch" style={{ display: "flex" }}>
                  <Button
                    color="secondary"
                    variant="contained"
                    type="button"
                    onClick={() =>
                      onChange([...value, diagnosisCode.current?.value])
                    }
                  >
                    +
                  </Button>
                </Grid>
              </Grid>
              {value.map((s: string) => (
                <Chip label={s} key={s} sx={{margin: 1}} onDelete={() => {
                  onChange(value.filter((v: string) => v !== s))
                }} />
              ))}
            </>
          )}
        />
        <div style={{ margin: "15px" }}>
          <InputLabel>Entry Type</InputLabel>
          <Controller
            control={methods.control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <div>
                <Select
                  label="Entry"
                  fullWidth
                  displayEmpty
                  value={value || ""}
                  onChange={onChange}
                >
                  {entryOptions.map((option) => (
                    <MenuItem key={option.label} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {value ? <EntryForm entry={value} /> : null}
              </div>
            )}
          />
        </div>
        <Grid>
          <Grid item>
            <Button
              color="error"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "left",
              }}
              color="success"
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
        <input
          type="hidden"
          {...methods.register("patientId")}
          defaultValue={patientId}
        />
      </form>
    </FormProvider>
  );
};

export default AddDiagnosisForm;
