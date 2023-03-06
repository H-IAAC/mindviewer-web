import { useState } from 'react';
import SetupMenuViewProps from '../../@types/SetupMenuViewProps';
import styles from './styles.module.css';

const SetupMenuView = (props: SetupMenuViewProps) => {
  const {
    stage,
    selectedOption
  } = props.setupMenuState;
  const {
    handleSelectedOption,
    handleStage,
    handleUrlOption,
    handleFileOption
  } = props;

  const [url, setUrl] = useState("");
  const [files, setFiles] = useState<FileList>()

  if (stage === 0)
    return(
      <div className={styles.container}>
        <div className={styles.menu}>
          <div className={styles.title}>
            Selecione a fonte dos dados:
          </div>
          <div className={styles.options}>
            <div className={styles.option}>
              <input id="urlOption1" type="checkbox" checked={selectedOption===0} onChange={() => handleSelectedOption(0)}/>
              <label htmlFor="urlOption1">Url de acesso</label>
            </div>
            <div className={styles.option}>
              <input id="urlOption2" type="checkbox" checked={selectedOption===1} onChange={() => handleSelectedOption(1)}/>
              <label htmlFor="urlOption2">Arquivo de logs</label>
            </div>
          </div>
          <div className={styles.buttons}>
            <button onClick={() => handleStage(1)}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )

  return(
    <div className={styles.container}>
      {selectedOption === 0?
        <div className={styles.menu}>
          <div className={styles.title}>
            Insira a URL de acesso:
          </div>
          <div className={styles.options}>
            <input 
              type="text" 
              placeholder="https://site.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>
          <div className={styles.buttons} style={{justifyContent: 'space-between'}}>
            <button onClick={() => handleStage(0)}>
              Voltar
            </button>
            <button onClick={() => handleUrlOption(url)}>
              Confirmar
            </button>
          </div>
        </div>
        :
        <div className={styles.menu}>
          <div className={styles.title}>
            Selecione o arquivo:
          </div>
          <div className={styles.options}>
            <input type="file" onChange={e => e.target.files && setFiles(e.target.files)} multiple/>
          </div>
          <div className={styles.buttons} style={{justifyContent: 'space-between'}}>
            <button onClick={() => handleStage(0)}>
              Voltar
            </button>
            <button onClick={() => handleFileOption(files)}>
              Confirmar
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default SetupMenuView;