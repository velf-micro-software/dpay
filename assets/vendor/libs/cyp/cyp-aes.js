!function(e,r){"object"==typeof exports?module.exports=exports=r(require("./core"),require("./enc-base64"),require("./md5"),require("./evpkdf"),require("./cipher-core")):"function"==typeof define&&define.amd?define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],r):r(e.CryptoJS)}(this,function(e){for(var r=e,o=r.lib.BlockCipher,i=r.algo,h=[],t=[],n=[],c=[],s=[],d=[],u=[],f=[],y=[],p=[],_=[],a=0;a<256;a++)_[a]=a<128?a<<1:a<<1^283;for(var k=0,l=0,a=0;a<256;a++){var v=l^l<<1^l<<2^l<<3^l<<4,S=(h[k]=v=v>>>8^255&v^99,_[t[v]=k]),B=_[S],R=_[B],q=257*_[v]^16843008*v;n[k]=q<<24|q>>>8,c[k]=q<<16|q>>>16,s[k]=q<<8|q>>>24,d[k]=q,u[v]=(q=16843009*R^65537*B^257*S^16843008*k)<<24|q>>>8,f[v]=q<<16|q>>>16,y[v]=q<<8|q>>>24,p[v]=q,k?(k=S^_[_[_[R^S]]],l^=_[_[l]]):k=l=1}var C=[0,1,2,4,8,16,32,64,128,27,54],i=i.AES=o.extend({_doReset:function(){if(!this._nRounds||this._keyPriorReset!==this._key){for(var e=this._keyPriorReset=this._key,r=e.words,o=e.sigBytes/4,i=4*(1+(this._nRounds=6+o)),t=this._keySchedule=[],n=0;n<i;n++)n<o?t[n]=r[n]:(d=t[n-1],n%o?6<o&&n%o==4&&(d=h[d>>>24]<<24|h[d>>>16&255]<<16|h[d>>>8&255]<<8|h[255&d]):(d=h[(d=d<<8|d>>>24)>>>24]<<24|h[d>>>16&255]<<16|h[d>>>8&255]<<8|h[255&d],d^=C[n/o|0]<<24),t[n]=t[n-o]^d);for(var c=this._invKeySchedule=[],s=0;s<i;s++){var d,n=i-s;d=s%4?t[n]:t[n-4],c[s]=s<4||n<=4?d:u[h[d>>>24]]^f[h[d>>>16&255]]^y[h[d>>>8&255]]^p[h[255&d]]}}},encryptBlock:function(e,r){this._doCryptBlock(e,r,this._keySchedule,n,c,s,d,h)},decryptBlock:function(e,r){var o=e[r+1],o=(e[r+1]=e[r+3],e[r+3]=o,this._doCryptBlock(e,r,this._invKeySchedule,u,f,y,p,t),e[r+1]);e[r+1]=e[r+3],e[r+3]=o},_doCryptBlock:function(e,r,o,i,t,n,c,s){for(var d=this._nRounds,h=e[r]^o[0],u=e[r+1]^o[1],f=e[r+2]^o[2],y=e[r+3]^o[3],p=4,_=1;_<d;_++)var a=i[h>>>24]^t[u>>>16&255]^n[f>>>8&255]^c[255&y]^o[p++],k=i[u>>>24]^t[f>>>16&255]^n[y>>>8&255]^c[255&h]^o[p++],l=i[f>>>24]^t[y>>>16&255]^n[h>>>8&255]^c[255&u]^o[p++],v=i[y>>>24]^t[h>>>16&255]^n[u>>>8&255]^c[255&f]^o[p++],h=a,u=k,f=l,y=v;a=(s[h>>>24]<<24|s[u>>>16&255]<<16|s[f>>>8&255]<<8|s[255&y])^o[p++],k=(s[u>>>24]<<24|s[f>>>16&255]<<16|s[y>>>8&255]<<8|s[255&h])^o[p++],l=(s[f>>>24]<<24|s[y>>>16&255]<<16|s[h>>>8&255]<<8|s[255&u])^o[p++],v=(s[y>>>24]<<24|s[h>>>16&255]<<16|s[u>>>8&255]<<8|s[255&f])^o[p++];e[r]=a,e[r+1]=k,e[r+2]=l,e[r+3]=v},keySize:8});return r.AES=o._createHelper(i),e.AES});