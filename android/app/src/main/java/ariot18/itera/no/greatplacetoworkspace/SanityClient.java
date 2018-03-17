package ariot18.itera.no.greatplacetoworkspace;

import android.content.Context;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.toolbox.JsonObjectRequest;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

public class SanityClient {

    private final String API_KEY = BuildConfig.SANITY_API_KEY;
    private final String SANITY_API_BASE = "https://k06fkcmv.api.sanity.io/v1/data/";
    private HttpClient httpClient;

    public SanityClient(Context context) {
        httpClient = HttpClient.getInstance(context.getApplicationContext());
    }

    private Map<String, String> makeAuthHeader() {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json; charset=UTF-8");
        headers.put("Authorization", "Bearer " + API_KEY);
        return headers;
    }

    public void getPerson(String cardId, Response.Listener<JSONObject> onSuccess, Response.ErrorListener onError) {
        String url = null;
        try {
            url = SANITY_API_BASE + "query/production/?query="+ URLEncoder.encode("*[id == '" + cardId + "']", "utf8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.GET,
                url,
                null,
                onSuccess,
                onError
        ) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                return makeAuthHeader();
            }
        };
        httpClient.addToRequestQueue(request);
    }

    public void createOrReplacePerson(Person person, Response.Listener<JSONObject> onSuccess, Response.ErrorListener onError) {
        String url = SANITY_API_BASE + "mutate/production/?returnIds=false&returnDocuments=true&visibility=sync";
        JSONObject body = null;
        String sanityIdString = "";
        if (person.getSanityId() != null) {
            sanityIdString = " \"_id\": \"" + person.getSanityId() + "\", ";
        }
        try {
            body = new JSONObject(
                    "{\"mutations\": [{\"createOrReplace\": {\"_type\": \"person\"," + sanityIdString + "\"id\": \"" + person.getId() + "\", \"name\": \"" + person.getName() + "\", \"tempPreferences\":" + Integer.valueOf(person.getTempPreferences()) + ", \"tablePreferences\": {\"_type\": \"tableSettings\", \"heightSitting\":" + Integer.valueOf(person.getPreferredSittingHeight()) + ", \"heightStanding\":" + Integer.valueOf(person.getPreferredStandingHeight()) + "}}}]}");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.POST,
                url,
                body,
                onSuccess,
                onError
        ) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                return makeAuthHeader();
            }
        };
        httpClient.addToRequestQueue(request);
    }
}
