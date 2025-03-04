import { useState, useEffect, useCallback, ReactNode, FC } from 'react';
import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import {
    typography,
    spacingsPx,
    borders,
    Elevation,
    mapElevationToBackground,
    mapElevationToBorder,
} from '@trezor/theme';
import { Icon } from '@suite-common/icons/src/webComponents';
import { motionEasing } from '../../config/motion';
import { ElevationUp, useElevation } from './../ElevationContext/ElevationContext';

const animationVariants = {
    closed: {
        opacity: 0,
        height: 0,
    },
    expanded: {
        opacity: 1,
        height: 'auto',
    },
};

type Fill = 'default' | 'none';

type WrapperProps = {
    $variant: 'small' | 'large'; // TODO: reevaluate variants
    $elevation: Elevation;
};

const Container = styled.div`
    flex: 1;
`;

const Filled = styled.div<WrapperProps>`
    background: ${mapElevationToBackground};
    border-radius: ${borders.radii.sm};
    border: 1px solid ${mapElevationToBorder};

    /* when theme changes from light to dark */
    transition: background 0.3s;

    ${({ $variant, theme }) =>
        $variant === 'large' &&
        css`
            border-radius: ${borders.radii.md};
            box-shadow: ${theme.boxShadowBase};
        `}
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    overflow: hidden;
    transition: opacity 0.15s;
`;

type HeaderProps = {
    $variant: 'small' | 'large'; // TODO: reevaluate variants
};

const Header = styled.div<HeaderProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${spacingsPx.xl};
    padding: ${({ $variant }) =>
        $variant === 'small'
            ? `${spacingsPx.sm} ${spacingsPx.md}`
            : `${spacingsPx.md} ${spacingsPx.xl}`};
    cursor: pointer;

    &:hover {
        ${IconWrapper} {
            opacity: 0.5;
        }
    }
`;

const IconLabel = styled.div`
    margin-right: ${spacingsPx.sm};
    color: ${({ theme }) => theme.textSubdued};
    ${typography.hint}
`;

type HeadingProps = {
    $variant: 'small' | 'large'; // TODO: reevaluate variants
};

const Heading = styled.span<HeadingProps>`
    display: flex;
    align-items: center;
    ${typography.body}
`;

const SubHeading = styled.span`
    ${typography.hint}
    color: ${({ theme }) => theme.textSubdued};
`;

const Flex = styled.div`
    flex: 1;
`;

const easingValues = motionEasing.transition.join(', ');
const ANIMATION_DURATION = 0.4;
const StyledIcon = styled(Icon)<{ $isCollapsed?: boolean }>`
    transform: ${({ $isCollapsed }) => ($isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)')};

    /* to sync with the expand animation */
    transition: transform ${ANIMATION_DURATION}s cubic-bezier(${easingValues});
    transform-origin: center;
`;

type ContentProps = {
    $variant: CollapsibleBoxProps['variant'];
    $elevation: Elevation;
    $filled: Fill;
};

const Content = styled.div<ContentProps>`
    display: flex;
    flex-direction: column;
    padding: ${({ $variant }) =>
        $variant === 'small'
            ? `${spacingsPx.lg} ${spacingsPx.md}`
            : `${spacingsPx.xl} ${spacingsPx.md}`};

    overflow: hidden;
    ${({ $filled, theme, $elevation }) =>
        $filled &&
        css`
            border-top: 1px solid ${mapElevationToBorder({ $elevation, theme })};
        `}
`;

const Collapser = styled(motion.div)`
    overflow: hidden;
`;

export interface CollapsibleBoxProps {
    heading?: ReactNode;
    subHeading?: ReactNode;
    variant: 'small' | 'large'; // @TODO: use `size` instead of `variant`
    filled?: Fill; //@TODO unify naming with other components
    iconLabel?: ReactNode;
    isOpen?: boolean;
    onCollapse?: () => void;
    children?: ReactNode;
    isUpwards?: boolean; // Open upwards, affects the icon rotation
}

type CollapsibleBoxSubcomponents = {
    Header: typeof Header;
    Heading: typeof Heading;
    Content: typeof Content;
    IconWrapper: typeof IconWrapper;
};

const CollapsibleBox: FC<CollapsibleBoxProps> & CollapsibleBoxSubcomponents = ({
    heading,
    subHeading,
    iconLabel,
    children,
    variant = 'small',
    isOpen = false,
    onCollapse,
    filled = 'default',
    isUpwards = false,
    ...rest
}: CollapsibleBoxProps) => {
    const [isCollapsed, setIsCollapsed] = useState(!isOpen);
    const { elevation } = useElevation();

    useEffect(() => {
        setIsCollapsed(!isOpen);
    }, [isOpen]);

    const handleHeaderClick = useCallback(() => {
        onCollapse?.();
        setIsCollapsed(!isCollapsed);
    }, [isCollapsed, onCollapse]);

    const content = (
        <>
            <Header $variant={variant} onClick={handleHeaderClick}>
                {(heading || subHeading) && (
                    <Flex>
                        {heading && <Heading $variant={variant}>{heading}</Heading>}
                        {subHeading && <SubHeading>{subHeading}</SubHeading>}
                    </Flex>
                )}

                <IconWrapper>
                    {iconLabel && <IconLabel>{iconLabel}</IconLabel>}
                    <StyledIcon
                        $isCollapsed={isUpwards ? !isCollapsed : isCollapsed}
                        onClick={() => setIsCollapsed(current => !current)}
                        name="caretCircleDown"
                        size="medium"
                    />
                </IconWrapper>
            </Header>

            <Collapser
                initial={false} // Prevents animation on mount when expanded === false
                variants={animationVariants}
                animate={!isCollapsed ? 'expanded' : 'closed'}
                transition={{
                    duration: ANIMATION_DURATION,
                    ease: motionEasing.transition,
                    opacity: {
                        ease: isCollapsed ? motionEasing.enter : motionEasing.exit,
                    },
                }}
                data-test="@collapsible-box/body"
            >
                <Content $elevation={elevation} $variant={variant} $filled={filled}>
                    <ElevationUp>{children}</ElevationUp>
                </Content>
            </Collapser>
        </>
    );

    return filled === 'default' ? (
        <Container>
            <Filled $variant={variant} {...rest} $elevation={elevation}>
                {content}
            </Filled>
        </Container>
    ) : (
        <Container>{content}</Container>
    );
};

CollapsibleBox.Header = Header;
CollapsibleBox.Heading = Heading;
CollapsibleBox.Content = Content;
CollapsibleBox.IconWrapper = IconWrapper;

export { CollapsibleBox };
