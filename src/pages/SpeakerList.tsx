import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonList, IonGrid, IonRow, IonCol } from '@ionic/react';
import SpeakerItem from '../components/SpeakerItem';
import { Speaker } from '../models/Speaker';
import { Session } from '../models/Session';
import { connect } from '../data/connect';
import * as selectors from '../data/selectors';
import './SpeakerList.scss';

interface OwnProps { };

interface StateProps {
  speakers: Speaker[];
  speakerSessions: { [key: number]: Session[] };
};

interface DispatchProps { };

interface SpeakerListProps extends OwnProps, StateProps, DispatchProps { };

const SpeakerList: React.FC<any> = (props) => {
  console.log(props)
  return (
    <IonPage id="speaker-list">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Doctors</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`outer-content`}>
        <IonList>
          <IonGrid fixed>
            <IonRow align-items-stretch>
              {/* {props.sessionGroups.map((p:any) => (
                <IonCol size="12" size-md="6" key={p.id}>
                  <h1>{p.id}</h1>
                </IonCol>
              ))} */}
            </IonRow>
          </IonGrid>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    speakers: selectors.getSpeakers(state),
    speakerSessions: selectors.getSpeakerSessions(state)
  }),
  component: React.memo(SpeakerList)
});