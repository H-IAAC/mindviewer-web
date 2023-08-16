

class SetupMenuUtils {
    public readFile = async (file: File) => {
        return new Promise<string>((resolve, reject) => {
          var reader = new FileReader();  
          reader.onload = () => {
            if (typeof reader.result === "string") {
                let content: string = reader.result;
                resolve(content);
            }
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
    }


    public getBase64FromFile = async (file: File) => {
        return new Promise<string>((resolve, reject) => {
            var reader = new FileReader();

            reader.onload = (f => (e: any) => {
                let base64: string = e.target.result;
                resolve(base64);          
            })(file);

            reader.readAsDataURL(file);
        });
    }
}

export default SetupMenuUtils;