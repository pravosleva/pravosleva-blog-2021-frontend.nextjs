import React from 'react'
// import { themeColor } from '@/ui-kit';
import { Icon } from '@/ui-kit/atoms/Icon'
import { ModalHeaderContainer } from './components/ModalHeaderContainer'
import { ModalTitle } from './components/ModalTitle'
import { ModalSubtitle } from './components/ModalSubtitle'
import { ModalHeaderDivider } from './components/ModalHeaderDivider'
import { CloseButton } from './components/CloseButton'

type TProps = {
  modalTitle: string;
  modalSubtitle?: string;
  closeModal: () => void;
}

export const ModalHeader = ({ modalTitle, modalSubtitle, closeModal }: TProps) => (
  <ModalHeaderContainer>
    <ModalTitle>{modalTitle}</ModalTitle>
    {!!modalSubtitle && <ModalSubtitle>{modalSubtitle}</ModalSubtitle>}
    <ModalHeaderDivider />
    <CloseButton onClick={closeModal}>
      <Icon name="x-close" sizeVariation="32px" defaultColor="Gray-blue" />
    </CloseButton>
  </ModalHeaderContainer>
)

// ModalHeader.propTypes = {
//   modalTitle: PropTypes.string.isRequired,
//   modalSubtitle: PropTypes.string.isRequired,
//   closeModal: PropTypes.func.isRequired,
// };
