import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../types";

import StarIcon from "@mui/icons-material/StarBorderOutlined";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";

const Star = ({ rating }: { rating: HealthCheckRating }) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return <StarIcon style={{ color: "#a2ff8d" }} />;
    case HealthCheckRating.LowRisk:
      return <StarIcon style={{ color: "#f3ff8d" }} />;
    case HealthCheckRating.HighRisk:
      return <StarIcon style={{ color: "#ffde8d" }} />;
    case HealthCheckRating.CriticalRisk:
      return <StarIcon style={{ color: "#ffd2d2" }} />;
    default:
      assertNever(rating);
      return <div>error</div>;
  }
};

const Hospital = ({
  entry,
  diagnoses,
}: {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}) => {
  return (
    <div>
      <p>
        {entry.date} <LocalHospitalIcon />
      </p>
      <p>
        <em>{entry.description}</em>
      </p>
      <ul>
        {diagnoses
          ? diagnoses.map((d) => (
              <li key={d.code}>
                <strong>{d.code}</strong> {d.name}
              </li>
            ))
          : null}
      </ul>
      <p>discharge: {entry.discharge.date}</p>
      <p>criteria: {entry.discharge.criteria}</p>
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const OccupationalHealthcare = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}) => {
  return (
    <div>
      <p>
        {entry.date} {entry.employerName} <MedicalInformationIcon />
      </p>
      <p>
        <em>{entry.description}</em>
      </p>
      <ul>
        {diagnoses
          ? diagnoses.map((d) => (
              <li>
                <strong>{d.code}</strong> {d.name}
              </li>
            ))
          : null}
      </ul>
      {entry.sickLeave ? (
        <p>
          sick leave: {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}
        </p>
      ) : null}
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const HealthCheck = ({
  entry,
  diagnoses,
}: {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}) => {
  return (
    <div>
      <p>
        {entry.date} <LibraryAddCheckIcon />
      </p>
      <p>
        <em>{entry.description}</em>
      </p>
      <ul>
        {diagnoses
          ? diagnoses.map((d) => (
              <li>
                <strong>{d.code}</strong> {d.name}
              </li>
            ))
          : null}
      </ul>
      <Star rating={entry.healthCheckRating} />
      <p>diagnose by {entry.specialist}</p>
    </div>
  );
};

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {
  const fullDiagnoses: Diagnosis[] = entry.diagnosisCodes?.map(
    (code) => diagnoses.find((d) => d.code === code)!,
  )!;

  switch (entry.type) {
    case "Hospital":
      return <Hospital entry={entry} diagnoses={fullDiagnoses} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcare entry={entry} diagnoses={fullDiagnoses} />;
    case "HealthCheck":
      return <HealthCheck entry={entry} diagnoses={fullDiagnoses} />;
    default:
      return assertNever(entry);
  }
};

const assertNever = (value: never): never => {
  throw new Error(`unhandled union member ${JSON.stringify(value)}`);
};

export default EntryDetails;
