import styled from 'styled-components';

import { Text, Radio, Icon, useElevation } from '@trezor/components';
import { Elevation, borders, mapElevationToBorder, spacingsPx, typography } from '@trezor/theme';
import { Translation } from 'src/components/suite';

type ViewOnlyRadiosProps = {
    isViewOnlyActive: boolean;
    toggleViewOnly: () => void;
    dataTest?: string;
};
type ViewOnlyRadioProps = {
    title: React.ReactNode;
    children: React.ReactNode;
    onClick: () => void;
    isChecked: boolean;
    dataTest?: string;
};
const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${spacingsPx.xs};
`;
const Left = styled.div``;

const Title = styled.div``;

const Item = styled.div<{ $elevation: Elevation; $isChecked: boolean }>`
    display: flex;
    align-items: center;
    gap: ${spacingsPx.xs};
    border-radius: ${borders.radii.md};
    padding: ${spacingsPx.md};
    border: solid 1.5px
        ${({ theme, $isChecked, $elevation }) =>
            $isChecked
                ? theme.backgroundSecondaryDefault
                : mapElevationToBorder({ theme, $elevation })};
`;

const SendCoinsInfo = styled.div`
    display: flex;
    align-items: center;
    gap: ${spacingsPx.xxs};
    margin: ${spacingsPx.md} auto;
    color: ${({ theme }) => theme.textSubdued};
    ${typography.label}
`;

export const ViewOnlyRadio = ({
    title,
    children,
    onClick,
    isChecked,
    dataTest,
}: ViewOnlyRadioProps) => {
    const { elevation } = useElevation();

    return (
        <Item onClick={onClick} $elevation={elevation} $isChecked={isChecked}>
            <Left>
                <Title>{title}</Title>
                <Text typographyStyle="hint" color="subdued">
                    {children}
                </Text>
            </Left>
            <Radio onClick={onClick} isChecked={isChecked} data-test={dataTest} />
        </Item>
    );
};
export const ViewOnlyRadios = ({
    isViewOnlyActive,
    toggleViewOnly,
    dataTest,
}: ViewOnlyRadiosProps) => {
    const handleConfirm = (newValue: boolean) => {
        const isValueChanged = isViewOnlyActive !== newValue;
        if (isValueChanged) {
            toggleViewOnly();
        }
    };

    return (
        <Container>
            <ViewOnlyRadio
                title={<Translation id="TR_VIEW_ONLY_RADIOS_ENABLED_TITLE" />}
                onClick={() => handleConfirm(true)}
                isChecked={isViewOnlyActive}
                dataTest={`${dataTest}/enabled`}
            >
                <Translation
                    id="TR_VIEW_ONLY_RADIOS_ENABLED_DESCRIPTION"
                    values={{
                        strong: chunks => <strong>{chunks}</strong>,
                    }}
                />
            </ViewOnlyRadio>
            <ViewOnlyRadio
                title={<Translation id="TR_VIEW_ONLY_RADIOS_DISABLED_TITLE" />}
                onClick={() => handleConfirm(false)}
                isChecked={!isViewOnlyActive}
                dataTest={`${dataTest}/disabled`}
            >
                <Translation
                    id="TR_VIEW_ONLY_RADIOS_DISABLED_DESCRIPTION"
                    values={{
                        strong: chunks => <strong>{chunks}</strong>,
                    }}
                />
            </ViewOnlyRadio>

            <SendCoinsInfo>
                <Icon icon="INFO" size={12} />
                <Translation id="TR_VIEW_ONLY_SEND_COINS_INFO" />
            </SendCoinsInfo>
        </Container>
    );
};
