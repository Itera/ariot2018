package ariot18.itera.no.greatplacetoworkspace;

import android.os.Parcel;
import android.os.Parcelable;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Person implements Parcelable {

    private String name;
    private String id;
    private String sanityId;
    private String preferredSittingHeight;
    private String preferredStandingHeight;
    private String tempPreferences;

    public Person() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPreferredSittingHeight() {
        return preferredSittingHeight;
    }

    public void setPreferredSittingHeight(String preferredSittingHeight) {
        this.preferredSittingHeight = preferredSittingHeight;
    }

    public String getPreferredStandingHeight() {
        return preferredStandingHeight;
    }

    public void setPreferredStandingHeight(String preferredStandingHeight) {
        this.preferredStandingHeight = preferredStandingHeight;
    }


    protected Person(Parcel in) {
        name = in.readString();
        id = in.readString();
        sanityId = in.readString();
        tempPreferences = in.readString();
        preferredSittingHeight = in.readString();
        preferredStandingHeight = in.readString();
    }

    public static final Creator<Person> CREATOR = new Creator<Person>() {
        @Override
        public Person createFromParcel(Parcel in) {
            return new Person(in);
        }

        @Override
        public Person[] newArray(int size) {
            return new Person[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(name);
        dest.writeString(id);
        dest.writeString(sanityId);
        dest.writeString(tempPreferences);
        dest.writeString(preferredSittingHeight);
        dest.writeString(preferredStandingHeight);
    }

    public static Person fromSanityResponse(JSONObject response) {
        Person res = new Person();
        try {
            JSONArray resultList = (JSONArray) response.get("result");
            if (resultList.length() == 0) {
                return res;
            }
            JSONObject obj = (JSONObject) resultList.get(0);
            res.setName(obj.getString("name"));
            res.setSanityId(obj.getString("_id"));
            res.setTempPreferences(obj.getString("tempPreferences"));
            JSONObject tablePrefs = obj.getJSONObject("tablePreferences");
            res.setPreferredSittingHeight(tablePrefs.getString("heightSitting"));
            res.setPreferredStandingHeight(tablePrefs.getString("heightStanding"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return res;
    }

    public String toString() {
        return name + tempPreferences + preferredSittingHeight + preferredStandingHeight;
    }

    public String getTempPreferences() {
        return tempPreferences;
    }

    public void setTempPreferences(String tempPreferences) {
        this.tempPreferences = tempPreferences;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSanityId() {
        return sanityId;
    }

    public void setSanityId(String sanityId) {
        this.sanityId = sanityId;
    }
}
