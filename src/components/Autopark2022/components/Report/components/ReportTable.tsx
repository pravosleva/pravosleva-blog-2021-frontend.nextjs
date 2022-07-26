import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

type TReport = {
  id: string;
  name: string;
  description: string;
  mileage: {
    last: number;
    delta: number;
  }
  diff: number;
}
type TProps = {
  report: TReport[]
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export const ReportTable = ({
  report
}: TProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Расходники</StyledTableCell>
            <StyledTableCell align="right">Left, km</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {report.map(({ name, description, id, diff }) => (
            <StyledTableRow
              key={id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {name}
                <br />
                <small>{description}</small>
              </StyledTableCell>
              <StyledTableCell align="right">{diff}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}