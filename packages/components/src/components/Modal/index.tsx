/* stylelint-disable indentation */

import * as React from 'react';
import styled, { css } from 'styled-components';
import { useKeyPress } from '../../utils/hooks';

import { Icon } from '../Icon';
import { H2 } from '../typography/Heading';
import { colors, variables } from '../../config';

// each item in array corresponds to a screen size  [SM, MD, LG, XL]
const MODAL_PADDING_BOTTOM: [string, string, string, string] = ['16px', '35px', '35px', '35px'];
const MODAL_PADDING_BOTTOM_TINY: [string, string, string, string] = [
    '16px',
    '24px',
    '24px',
    '24px',
];

const SIDE_PADDING: [string, string, string, string] = ['8px', '40px', '40px', '40px'];
const SIDE_PADDING_TINY: [string, string, string, string] = ['8px', '32px', '32px', '32px'];

const FIXED_WIDTH: [string, string, string, string] = ['100vw', '90vw', '720px', '720px'];
const FIXED_WIDTH_SMALL: [string, string, string, string] = ['100vw', '90vw', '600px', '600px'];
const FIXED_WIDTH_TINY: [string, string, string, string] = ['360px', '360px', '360px', '360px'];
const FIXED_HEIGHT: [string, string, string, string] = ['90vh', '90vh', '620px', '620px'];

const ModalOverlay = styled.div`
    position: fixed;
    z-index: 10000;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    justify-content: center;
`;

const Header = styled.div`
    margin-bottom: 25px;
`;

type ModalWindowProps = Omit<Props, 'fixedWidth' | 'fixedHeight' | 'modalPaddingBottom'> &
    Required<Pick<Props, 'fixedWidth' | 'fixedHeight' | 'modalPaddingBottom'>>; // make some props mandatory
const ModalWindow = styled.div<ModalWindowProps>`
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 6px;
  text-align: center;
  overflow-x: hidden; /* retains border-radius when using background in child component */
  padding-bottom: ${(props: ModalWindowProps) => props.modalPaddingBottom[3]};


  /* prettier fails to format it properly */

  @media only screen and (max-width: ${variables.SCREEN_SIZE.SM}) {
    padding-bottom: ${(props: ModalWindowProps) => props.modalPaddingBottom[0]};
  }

  @media only screen and (min-width: ${variables.SCREEN_SIZE.SM}) and (max-width: ${
    variables.SCREEN_SIZE.MD
}) {
    padding-bottom: ${(props: ModalWindowProps) => props.modalPaddingBottom[1]};
  }

  @media only screen and (min-width: ${variables.SCREEN_SIZE.MD}) and (max-width: ${
    variables.SCREEN_SIZE.LG
}) {
    padding-bottom: ${(props: ModalWindowProps) => props.modalPaddingBottom[2]};
  }

  ${props =>
      !props.noBackground &&
      css`
          background: ${colors.WHITE};
          box-shadow: 0 10px 80px 0 rgba(77, 77, 77, 0.2);
      `}

  /* if bottomBar is active we need to disable bottom padding */
    ${props =>
        props.bottomBar &&
        css`
            padding-bottom: 0px;
            @media only screen and (max-width: ${variables.SCREEN_SIZE.SM}) {
                padding-bottom: 0px;
            }
        `}
    
    /* content-based width mode */
    ${props =>
        !props.useFixedWidth &&
        css`
            max-width: 100vw;
        `}

    ${props =>
        !props.useFixedHeight &&
        css`
            max-height: 90vh;
        `}

    /* Fixed width mode */
    ${props =>
        props.useFixedWidth &&
        props.fixedWidth &&
        css`
            /* default width is the same as for XL screens */
            width: ${(props: ModalWindowProps) => props.fixedWidth[3]};
            /* for smaller screens width is set based on fixedWidth prop */
            @media only screen and (max-width: ${variables.SCREEN_SIZE.SM}) {
                width: ${(props: ModalWindowProps) => props.fixedWidth[0]};
            }
            @media only screen and (min-width: ${variables.SCREEN_SIZE
                    .SM}) and (max-width: ${variables.SCREEN_SIZE.MD}) {
                width: ${(props: ModalWindowProps) => props.fixedWidth[1]};
            }
            @media only screen and (min-width: ${variables.SCREEN_SIZE
                    .MD}) and (max-width: ${variables.SCREEN_SIZE.LG}) {
                width: ${(props: ModalWindowProps) => props.fixedWidth[2]};
            }
        `}

    ${props =>
        props.useFixedHeight &&
        props.fixedHeight &&
        css`
            /* default height is the same as for XL screens */
            height: ${(props: ModalWindowProps) => props.fixedHeight[3]};
            /* for smaller screens height is set based on fixedHeight prop */
            @media only screen and (max-width: ${variables.SCREEN_SIZE.SM}) {
                height: ${(props: ModalWindowProps) => props.fixedHeight[0]};
            }
            @media only screen and (min-width: ${variables.SCREEN_SIZE
                    .SM}) and (max-width: ${variables.SCREEN_SIZE.MD}) {
                height: ${(props: ModalWindowProps) => props.fixedHeight[1]};
            }
            @media only screen and (min-width: ${variables.SCREEN_SIZE
                    .MD}) and (max-width: ${variables.SCREEN_SIZE.LG}) {
                height: ${(props: ModalWindowProps) => props.fixedHeight[2]};
            }
        `}
`;

const Heading = styled(H2)<{ headerWithBorder: boolean }>`
    /*  set css attributes based on the type of Modal header*/
    display: ${props => (props.headerWithBorder ? 'flex' : 'block')};
    position: ${props => (props.headerWithBorder ? 'relative' : 'static')};
    text-align: ${props => (props.headerWithBorder ? 'left' : 'center')};
    border-bottom: ${props =>
        props.headerWithBorder ? `1px solid ${colors.NEUE_STROKE_GREY}` : 'none'};
    padding: ${props => (props.headerWithBorder ? '24px 32px' : '35px 32px 0px 32px')};

    justify-content: space-between; /* to move the closing button all the way to the right */

    @media only screen and (max-width: ${variables.SCREEN_SIZE.SM}) {
        padding: ${props => (props.headerWithBorder ? '18px 22px' : '35px 20px 0px 20px')};
    }
`;

const CancelIconWrapper = styled.div<{ headerWithBorder: boolean }>`
    /*  set css attributes based on the type of Modal header*/
    display: ${props => (props.headerWithBorder ? 'inline-block' : 'flex')};
    position: ${props => (props.headerWithBorder ? 'relative' : 'absolute')};
    top: ${props => (props.headerWithBorder ? 'auto' : '10px')};
    right: ${props => (props.headerWithBorder ? 'auto' : '10px')};

    align-items: center;
    margin-left: 30px;
    cursor: pointer;
`;

const SidePaddingWrapper = styled.div<{ sidePadding: [string, string, string, string] }>`
    /* This component applies responsive side padding to all components that inherit from this component */
    padding-left: ${props => props.sidePadding[3]};
    padding-right: ${props => props.sidePadding[3]};

    /* prettier fails to format it properly */

    @media only screen and (max-width: ${variables.SCREEN_SIZE.SM}) {
        padding-left: ${props => props.sidePadding[0]};
        padding-right: ${props => props.sidePadding[0]};
    }

    @media only screen and (min-width: ${variables.SCREEN_SIZE.SM}) and (max-width: ${variables
            .SCREEN_SIZE.MD}) {
        padding-left: ${props => props.sidePadding[1]};
        padding-right: ${props => props.sidePadding[1]};
    }
`;

const Description = styled(SidePaddingWrapper)`
    color: ${colors.BLACK50};
    font-size: ${variables.FONT_SIZE.SMALL};
    margin-bottom: 10px;
    text-align: center;
`;

const Content = styled(SidePaddingWrapper)`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    ::-webkit-scrollbar {
        background-color: #fff;
        width: 10px;
    }
    /* background of the scrollbar except button or resizer */
    ::-webkit-scrollbar-track {
        background-color: transparent;
    }
    /* scrollbar itself */
    ::-webkit-scrollbar-thumb {
        /* 7F7F7F for mac-like color */
        background-color: #babac0;
        border-radius: 10px;
        border: 2px solid #fff;
    }
    /* set button(top and bottom of the scrollbar) */
    ::-webkit-scrollbar-button {
        display: none;
    }
`;

const BottomBar = styled(SidePaddingWrapper)`
    display: flex;
    padding-top: 16px;
    padding-bottom: 16px;
`;

type SIZE = 'large' | 'small' | 'tiny';

const getFixedWidth = (size: SIZE) => {
    switch (size) {
        case 'large':
            return FIXED_WIDTH;
        case 'small':
            return FIXED_WIDTH_SMALL;
        case 'tiny':
            return FIXED_WIDTH_TINY;
        // no default
    }
};

// returns the value of padding-bottom for the main Modal container
const getModalPaddingBottom = (size: SIZE) => {
    switch (size) {
        case 'large':
            return MODAL_PADDING_BOTTOM;
        case 'small':
            return MODAL_PADDING_BOTTOM;
        case 'tiny':
            return MODAL_PADDING_BOTTOM_TINY;
        // no default
    }
};

// returns the value of padding-left/right
const getSidePadding = (size: SIZE) => {
    switch (size) {
        case 'large':
            return SIDE_PADDING;
        case 'small':
            return SIDE_PADDING;
        case 'tiny':
            return SIDE_PADDING_TINY;
        // no default
    }
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    heading?: React.ReactNode;
    header?: React.ReactNode;
    description?: React.ReactNode;
    bottomBar?: React.ReactNode;
    cancelable?: boolean;
    size?: SIZE;
    useFixedWidth?: boolean;
    fixedWidth?: [string, string, string, string]; // [SM, MD, LG, XL]
    useFixedHeight?: boolean;
    fixedHeight?: [string, string, string, string]; // [SM, MD, LG, XL]
    modalPaddingBottom?: [string, string, string, string]; // [SM, MD, LG, XL]
    sidePadding?: [string, string, string, string]; // [SM, MD, LG, XL]
    noBackground?: boolean;
    onCancel?: () => void;
    headerWithBorder?: boolean;
}

const Modal = ({
    children,
    heading,
    header,
    description,
    bottomBar,
    cancelable = true,
    onClick,
    onCancel,
    size = 'large',
    noBackground = false,
    useFixedWidth = true,
    fixedWidth = getFixedWidth(size),
    useFixedHeight = false,
    fixedHeight = FIXED_HEIGHT,
    modalPaddingBottom = getModalPaddingBottom(size),
    sidePadding = getSidePadding(size),
    headerWithBorder = true,
    ...rest
}: Props) => {
    const escPressed = useKeyPress('Escape');

    if (cancelable && onCancel && escPressed) {
        onCancel();
    }

    const modalWindow = (
        <ModalWindow
            size={size}
            useFixedWidth={useFixedWidth}
            fixedWidth={fixedWidth}
            useFixedHeight={useFixedHeight}
            fixedHeight={fixedHeight}
            modalPaddingBottom={modalPaddingBottom}
            bottomBar={bottomBar}
            noBackground={noBackground}
            onClick={e => {
                if (onClick) onClick(e);
                e.stopPropagation();
            }}
            {...rest}
        >
            {heading && (
                <Heading headerWithBorder={headerWithBorder}>
                    {heading}
                    {cancelable && (
                        <CancelIconWrapper onClick={onCancel} headerWithBorder={headerWithBorder}>
                            <Icon size={24} color={colors.NEUE_TYPE_DARK_GREY} icon="CROSS" />
                        </CancelIconWrapper>
                    )}
                </Heading>
            )}

            {description && <Description sidePadding={sidePadding}>{description}</Description>}
            <Content sidePadding={sidePadding}>{children}</Content>
            {bottomBar && <BottomBar sidePadding={sidePadding}>{bottomBar}</BottomBar>}
        </ModalWindow>
    );

    if (noBackground) {
        return modalWindow;
    }

    // if there is some background, return modal with a blurred background
    return (
        <ModalOverlay
            onClick={() => {
                if (cancelable && onCancel) {
                    onCancel();
                }
            }}
        >
            {header && <Header>{header}</Header>}
            {modalWindow}
        </ModalOverlay>
    );
};

export { Modal, Props as ModalProps };
