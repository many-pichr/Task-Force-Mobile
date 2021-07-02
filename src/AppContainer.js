import { createAppContainer } from "react-navigation";
import RootNavigation from "../Navigation";
import React from 'react';
const AppContainers = createAppContainer(RootNavigation);
import { withTranslation } from 'react-i18next';
class AppContainer extends React.Component {
    render() {
        const { t, i18n } = this.props;
        return (
       <AppContainers
                screenProps={{
                    t,
                    i18n
                }}
            />


        );
    }
}
export default withTranslation()(AppContainer);
