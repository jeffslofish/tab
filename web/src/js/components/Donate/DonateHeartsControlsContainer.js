import graphql from 'babel-plugin-relay/macro'
import { createFragmentContainer } from 'react-relay'

import DonateHeartsControlsComponent from 'js/components/Donate/DonateHeartsControlsComponent'

export default createFragmentContainer(DonateHeartsControlsComponent, {
  charity: graphql`
    fragment DonateHeartsControlsContainer_charity on Charity {
      id
      image
      imageCaption
      impact
      name
      website
    }
  `,
  user: graphql`
    fragment DonateHeartsControlsContainer_user on User {
      id
      vcCurrent
    }
  `,
})
