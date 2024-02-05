import React, { Component } from 'react'
import { CrossCloseIcon } from '../Icons/CrossCloseIcon'
import { InformIcon } from '../Icons/InformIcon'
import { CalendarIcon } from '../Icons/CalendarIcon'
import { CrossCloseCircleIcon } from '../Icons/CrossCloseCircleIcon'
import { OkStatusIcon } from '../Icons/OkStatusIcon'
import { EditIcon } from '../Icons/EditIcon'
import { MessageIcon } from '../Icons/MessageIcon'
import { ArrowBackIcon } from '../Icons/ArrowBackIcon'
import { ArrowUpIcon } from '../Icons/ArrowUpIcon'
import { ArrowDownIcon } from '../Icons/ArrowDownIcon'
import { PhoneIcon } from '../Icons/PhoneIcon'
import { EvacuatorIcon } from '../Icons/EvacuatorIcon'
import { OwnerPartsIcon } from '../Icons/OwnerPartsIcon'
import { ArrowLeftIcon } from '../Icons/ArrowLeftIcon'
import { FineIcon } from '../Icons/FineIcon'
import { AddIcon } from '../Icons/AddIcon'
import styled from 'styled-components'

const icons = {
  'x-close': CrossCloseIcon,
  inform: InformIcon,
  calendar: CalendarIcon,
  'x-close-circle': CrossCloseCircleIcon,
  'arrow-back': ArrowBackIcon,
  'ok-status': OkStatusIcon,
  edit: EditIcon,
  message: MessageIcon,
  'arrow-up': ArrowUpIcon,
  'arrow-down': ArrowDownIcon,
  phone: PhoneIcon,
  evacuator: EvacuatorIcon,
  'owner-parts': OwnerPartsIcon,
  'arrow-left': ArrowLeftIcon,
  fine: FineIcon,
  add: AddIcon,
}
const sizeVariations = {
  '24px': '24px',
  '32px': '32px',
  '14px mobile': '14px',
  '44px': '44px',
  '14px': '14px',
  '20px': '20px',
}

const getIcon = (name) => icons[name]
const getSize = (sizeVariation) => sizeVariations[sizeVariation]

const IconContainer = styled('span')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(p) => getSize(p.sizeVariation)};
  height: ${(p) => getSize(p.sizeVariation)};
`

export class Icon extends Component {
  state = {
    isHovered: false,
  }

  onMouseOver = () => this.setState({ isHovered: true })

  onMouseOut = () => this.setState({ isHovered: false })

  render() {
    const { name, sizeVariation, defaultColor, hoveredColor } = this.props
    const { isHovered } = this.state
    const RenderedIcon = getIcon(name)

    return (
      <IconContainer sizeVariation={sizeVariation} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        <RenderedIcon sizeVariation={sizeVariation} colorName={isHovered ? hoveredColor : defaultColor} />
      </IconContainer>
    )
  }
}

// Icon.propTypes = {
//   name: PropTypes.oneOf(Object.keys(icons)).isRequired,
//   sizeVariation: PropTypes.oneOf(['24px', '32px', '44px', '14px mobile'])
//     .isRequired,
//   defaultColor: PropTypes.string,
//   hoveredColor: PropTypes.string,
// };

// Icon.defaultProps = {
//   defaultColor: 'Light blue',
//   hoveredColor: 'Primary Dark Blue',
// };
