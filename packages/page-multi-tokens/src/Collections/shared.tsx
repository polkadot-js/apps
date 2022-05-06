import { css } from 'styled-components';

export const listItem = css`
    width: 100%;
    height: 90px;
    margin-bottom: 5px;
    background: var(--bg-tabs);
    border-radius: 4px;
    padding: 5px;
    border: 2px solid transparent;
    display: flex;
    align-items: center;
    transition: 0.2s ease;

    & > div {
        flex: 1;
    }

    &:hover {
        border: 2px solid var(--bg-page);
        cursor: pointer;
    }
`;
