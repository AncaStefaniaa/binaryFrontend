import React, { useState, useRef, useEffect } from 'react';
import { IonToolbar, IonContent, IonPage, IonButtons, IonMenuButton, IonSegment, IonSegmentButton, IonButton, IonIcon, IonSearchbar, IonRefresher, IonRefresherContent, IonToast, IonModal, IonHeader, getConfig } from '@ionic/react';
import { connect } from '../data/connect';
import { options } from 'ionicons/icons';
import SessionList from '../components/SessionList';
import SessionListFilter from '../components/SessionListFilter';
import './SchedulePage.scss'
import * as selectors from '../data/selectors';
import { setSearchText, addFavorite, removeFavorite } from '../data/sessions/sessions.actions';
import ShareSocialFab from '../components/ShareSocialFab';
import { SessionGroup } from '../models/SessionGroup';
import Axios from 'axios'
interface OwnProps { }

interface StateProps {
  sessionGroups: SessionGroup[];
  favoriteGroups: SessionGroup[];
  mode: 'ios' | 'md'
}

interface DispatchProps {
  setSearchText: typeof setSearchText;
}

type SchedulePageProps = OwnProps & StateProps & DispatchProps;

const SchedulePage: React.FC<any> = ({user, favoriteGroups, sessionGroups, setSearchText, mode }) => {
  const [segment, setSegment] = useState<'all' | 'favorites'>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const ionRefresherRef = useRef<HTMLIonRefresherElement>(null);
  const [showCompleteToast, setShowCompleteToast] = useState(false);
  const [incidente, setIncidente] = useState([]);
  const [update,setUpdate] =useState(false)
  const doRefresh = () => {
    setTimeout(() => {
      ionRefresherRef.current!.complete();
      setShowCompleteToast(true);
    }, 2500)
  };
  useEffect(()=>{
    Axios.get('http://192.168.0.185:9586/incidents/getincidents').then((response) => {
      setIncidente(response.data)
      setUpdate(true)
      setTimeout(()=>{setUpdate(false)},2000)
    })
  },[update])
  return (
    <IonPage id="schedule-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonSegment onIonChange={(e) => setSegment(e.detail.value as any)}>
            <IonSegmentButton value="all" checked={segment === 'all'}>
              All
            </IonSegmentButton>
           
          </IonSegment>

          <IonButtons slot="end">
            <IonButton onClick={() => setShowFilterModal(true)}>
              {mode === 'ios' ? 'Filter' : <IonIcon icon={options} slot="icon-only" />}
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonToolbar>
         
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" ref={ionRefresherRef} onIonRefresh={doRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <IonToast
          isOpen={showCompleteToast}
          message="Refresh complete"
          duration={2000}
          onDidDismiss={() => setShowCompleteToast(false)}
        />

        {/* <SessionList
          sessionGroups={sessionGroups}
          listType={segment}
          hide={segment === 'favorites'}
        /> */}
        {console.log(user)}
        {(user.doctor)&&
        <SessionList
          incidents={incidente}
        />}
      </IonContent>

      <IonModal
        isOpen={showFilterModal}
        onDidDismiss={() => setShowFilterModal(false)}
      >
        <SessionListFilter
          onDismissModal={() => setShowFilterModal(false)}
        />
      </IonModal>

      <ShareSocialFab />

    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    sessionGroups: selectors.getGroupedSessions(state),
    favoriteGroups: selectors.getGroupedFavorites(state),
    user:(state.user2)?state.user2:{doctor:false},
    mode: getConfig()!.get('mode')
  }),
  mapDispatchToProps: {
    setSearchText
  },
  component: React.memo(SchedulePage)
});