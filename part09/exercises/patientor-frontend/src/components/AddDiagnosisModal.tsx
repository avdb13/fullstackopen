import { Alert, Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";
import AddDiagnosisForm from "./AddDiagnosisForm";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  error?: string;
  patientId: string;
}

const AddDiagnosisModal = ({ modalOpen, onClose, onSubmit, error, patientId }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new patient</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddDiagnosisForm onSubmit={onSubmit} onCancel={onClose} patientId={patientId} />
    </DialogContent>
  </Dialog>
)

export default AddDiagnosisModal
