import React from 'react';

import {Alert, Button, Flex, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {I18n} from 'i18n';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import type {SdkError} from 'ui/libs/schematic-sdk';

import {AUTH_ROUTE} from '../../constants/routes';
import {submitSigninForm} from '../../store/actions/signin';
import {selectFormData} from '../../store/selectors/signin';

import {Login} from './components/Login';
import {Password} from './components/Password';

import './Signin.scss';

const i18n = I18n.keyset('auth.sign-in');

const b = block('dl-signin');

export const Signin = () => {
    const dispatch = useDispatch();

    const [errorMessage, setErrorMessage] = React.useState('');

    const formData = useSelector(selectFormData);

    const handleSigninError = (error: SdkError) => {
        if (error.status.toString().startsWith('4')) {
            setErrorMessage(i18n('label_error-incorrect-fields'));
        }
    };

    const handleSubmit = () => {
        if (!formData.login || !formData.password) {
            setErrorMessage(i18n('label_error-required-fields'));
            return;
        }

        dispatch(submitSigninForm({onError: handleSigninError}));
    };

    const handleFormChange = React.useCallback(() => {
        if (errorMessage) {
            setErrorMessage('');
        }
    }, [errorMessage]);

    return (
        <Flex className={b()} justifyContent="center" alignItems="center">
            <Flex className={b('form-container')} direction="column" gap="6" as="form">
                <Flex direction="column" gap="2" alignItems="center">
                    <div className={b('logo')} />
                    <Text variant="subheader-3">{i18n('title_product')}</Text>
                </Flex>
                <Flex direction="column" gap="4" as="form" onChange={handleFormChange}>
                    {errorMessage && <Alert theme="danger" message={errorMessage} />}
                    <Login />
                    <Password />
                    <Button size="l" view="action" onClick={handleSubmit}>
                        {i18n('button_sign-in')}
                    </Button>
                    <Flex>
                        {i18n('label_sign-up-hint')}
                        <Link to={AUTH_ROUTE.SIGNUP}>{i18n('label_sing-up-link')}</Link>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};
