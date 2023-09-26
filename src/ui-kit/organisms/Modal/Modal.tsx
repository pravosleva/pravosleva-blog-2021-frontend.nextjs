import React from 'react'
import { ModalHeader } from './components/ModalHeader'
import { ModalFooter } from './components/ModalFooter'
import { ModalBody } from './components/ModalBody'
import { ModalContainer } from './components/ModalContainer'
import { ModalContent, ESize } from './components/ModalContent'

export interface IModalProps {
  size: ESize;
  modalTitle: string;
  modalSubtitle?: string;
  closeModal: () => void;
  renderBodyContent: () => React.ReactNode;
  renderFooterContent?: () => JSX.Element;
}

export const Modal = ({
  size,
  modalTitle,
  modalSubtitle,
  closeModal,
  renderBodyContent,
  renderFooterContent,
}: IModalProps) => (
  <ModalContainer>
    <ModalContent size={size}>
      <ModalHeader modalTitle={modalTitle} modalSubtitle={modalSubtitle} closeModal={closeModal} />
      <ModalBody>{renderBodyContent()}</ModalBody>
      {!!renderFooterContent && <ModalFooter>{renderFooterContent()}</ModalFooter>}
      {!renderFooterContent && <div style={{ marginTop: '10px' }}></div>}
    </ModalContent>
  </ModalContainer>
)
