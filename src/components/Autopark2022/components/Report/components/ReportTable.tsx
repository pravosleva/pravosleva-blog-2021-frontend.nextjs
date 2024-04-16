import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { TReport } from '~/components/Autopark2022/components/Report/interfaces'
import Chip from '@mui/material/Chip'
import { getPrettyPrice } from '~/utils/getPrettyPrice'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

type TProps = {
  report: TReport[]
}

const StyledTableCell: any = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))
const StyledTableRow = styled(TableRow)(({
  // theme,
}) => ({
  // '&:nth-of-type(odd)': {
  //   backgroundColor: theme.palette.action.hover,
  // },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const deadLineKM = 500

export const ReportTable = ({
  report
}: TProps) => {
  return (
    <TableContainer
      component={Paper}
      style={{
        boxShadow: 'none',
        marginBottom: '16px',
      }}
    >
      <Table
        size='small'
        aria-label='simple table'
      >
        <TableHead>
          <TableRow>
            <StyledTableCell>Список расходников</StyledTableCell>
            <StyledTableCell align='right'>До замены</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {report.map(({ name, description, id, diff }) => {
            const isFired = diff < deadLineKM

            return (
              <StyledTableRow
                key={id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <StyledTableCell
                  component='th'
                  scope='row'
                  sx={{ pl: 0 }}
                >
                  {name}
                  <br />
                  <small>{description}</small>
                </StyledTableCell>
                <StyledTableCell
                  align='right'
                  sx={{ pr: 0 }}
                >
                  <Chip
                    icon={isFired ? <LocalFireDepartmentIcon /> : undefined}
                    label={<b>{getPrettyPrice(diff)}</b>} color={isFired ? 'error' : 'default'}
                  />
                </StyledTableCell>
              </StyledTableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}